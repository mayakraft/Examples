// const polygons = [
// 	[[0.1,0.1], [1.2,0.2], [1.45,0.76], [1.3,0.74], [0.35,0.5]],
// 	[[1.65,0], [2,0.3], [1.55,1], [0.75,0.45], [1,0.05]]
// ];

// const polygons = [
// 	[[0.1,-0.1], [1.2,-0.2], [1.45,-0.76], [1.3,-0.74], [0.35,-0.5]],
// 	[[1.65,0], [2,-0.3], [1.55,-1], [0.75,-0.45], [1,-0.05]]
// ];

svg.size(2, 1)
	.padding(0.05)
	.scale(1, -1)
	.strokeWidth(svg.getHeight() / 100);

// const polyFill1 = svg.polygon().stroke("none");
// const polyFill2 = svg.polygon().stroke("none");
const poly1 = svg.polygon().fill("none").stroke("black");
const poly2 = svg.polygon().fill("none").stroke("black");
const poly3 = svg.polygon().fill("#fb4").stroke("black");
const controlsLayer = svg.g();
const testLayer = svg.g();

const get_top_index = (poly, epsilon) => {
	let index = 0;
	for (let i = 0; i < poly.length; i++) {
		if (poly[i][1] > poly[index][1] - epsilon) { index = i; }
	}
	return index;
};
const get_bottom_index = (poly, epsilon) => {
	let index = 0;
	for (let i = 0; i < poly.length; i++) {
		if (poly[i][1] < poly[index][1] + epsilon) { index = i; }
	}
	return index;
};
/**
 * @description identify the highest and lowest Y points, split
 * the polygon into a left and right side, return two arrays
 * containing the ordered indices
 */
const split_polygon = (poly, epsilon) => {
	const top = get_top_index(poly, epsilon);
	const bottom = get_bottom_index(poly, epsilon);
	const sides = [[], []]; // [0]: left, [1]: right
	let side = 0;
	for (let i = top; i <= top + poly.length; i++) {
		const index = i % poly.length;
		sides[side].push(index);
		if (index === bottom) {
			side = 1;
			sides[side].push(index);
		}
	}
	return sides;
};

const intersect_convex_polygons = (poly1, poly2, epsilon = ear.math.EPSILON) => {
	testLayer.removeChildren();

	// console.log("poly 1 top", get_top_index(poly1, epsilon));
	// console.log("poly 2 top", get_top_index(poly2, epsilon));

	const polys = [poly1, poly2];
	const polys_halves = polys.map(poly => split_polygon(poly, epsilon));
	// the first point in either of the sides arrays is the top/bottom.
	const top_indices = polys.map((_, p) => polys_halves[p][0][0]);
	const bottom_indices = polys.map((_, p) => polys_halves[p][1][0]);
	// reverse the order of the right side of both polygons, this way
	// both arrays start from the top and move downwards.
	// (make sure to do this after top/bottom indices were gotten)
	polys_halves.forEach((_, i) => polys_halves[i][1].reverse());
	// console.log("polys_halves", polys_halves);
	// todo is the epsilon correct? minus?
	const polys_l_r = poly1[top_indices[0]][0] < poly2[top_indices[1]][0] - epsilon
		? [0, 1]
		: [1, 0];
	const left_poly = polys[polys_l_r[0]];
	const right_poly = polys[polys_l_r[1]];
	// these are indices in both of the polygons arrays
	const left_poly_right_half = polys_halves[polys_l_r[0]][1];
	const right_poly_left_half = polys_halves[polys_l_r[1]][0];
	const left_poly_right_half_points = left_poly_right_half.map(i => left_poly[i]);
	const right_poly_left_half_points = right_poly_left_half.map(i => right_poly[i]);
	// console.log("left_poly", left_poly);
	// console.log("right_poly", right_poly);
	// console.log("left_poly_right_half", left_poly_right_half);
	// console.log("right_poly_left_half", right_poly_left_half);
	// the length of the left polygon's right side and the right polygon's left side
	// minus 2, because we are checking the segments (fencepost between points).
	const check_length = left_poly_right_half.length
		+ right_poly_left_half.length
		- 2;
	// p_l and p_r are indices in left polygon and right polygon
	// these step forward as the line sweep reach one side or the other. 
	let p_l = 0;
	let p_r = 0;
	// pairs of indices: first is left/right (0/1), second is the index in that poly half.

	const get_intersection = (l0, l1, r0, r1) => {
		const left_vec = ear.math.subtract2(
			left_poly_right_half_points[l1],
			left_poly_right_half_points[l0]);
		const right_vec = ear.math.subtract2(
			right_poly_left_half_points[r1],
			right_poly_left_half_points[r0]);
		return ear.math.intersectLineLine(
			left_vec, left_poly_right_half_points[l0],
			right_vec, right_poly_left_half_points[r0],
			ear.math.includeS, ear.math.includeS, epsilon);
	};

	const zipper = [];
	const crossed_zipper_indices = [];
	const intersections = [];
	for (let i = 0; i < check_length; i++) {
		// the next points for each side that makes a segment
		const p_l_next = (p_l + 1) % left_poly_right_half_points.length;
		const p_r_next = (p_r + 1) % right_poly_left_half_points.length;
		const left_pt0 = left_poly_right_half_points[p_l];
		const left_pt1 = left_poly_right_half_points[p_l_next];
		const right_pt0 = right_poly_left_half_points[p_r];
		const right_pt1 = right_poly_left_half_points[p_r_next];
		// overlapping refers to the X values only. 
		const overlapping = Math.max(left_pt0[0], left_pt1[0])
			> Math.min(right_pt0[0], right_pt1[0]);
		if (overlapping) {
			// test for intersection
			const intersection = get_intersection(p_l, p_l_next, p_r, p_r_next);
			if (intersection) {
				intersections.push(intersection);
			}
		}
		// increment
		// todo is the epsilon correct?
		// step forward to whichever side is lower in the Y direction
		// OR, if we are at the end, one of them is undefined, so, include the other side
		if (left_pt1[1] > right_pt1[1] - epsilon) {
			zipper.push([0, p_l_next]);
			p_l++;
		} else {
			zipper.push([1, p_r_next]);
			p_r++;
		}
		// wtf to do here
		if (p_l === left_poly_right_half_points.length - 1) { p_l--; console.log("left", p_l); }
		if (p_r === right_poly_left_half_points.length - 1) { p_r--; console.log("right", p_r); }
	}

// 	if (crossed_zipper_indices.length) {
// 		console.log("crossed_zipper_indices", crossed_zipper_indices);
// 	}
// 	if (intersections.length) {
// 		console.log("intersections", intersections);
// 	}
	// console.log("zipper", zipper);
	const zipper_points = zipper.map(zip => zip[0] === 0
		? left_poly_right_half_points[zip[1]]
		: right_poly_left_half_points[zip[1]]);


	// draw stuff
	polys_halves.forEach((poly_halves, p) => poly_halves.forEach((half, i) => {
		for (let j = 0; j < half.length - 1; j++) {
			const i0 = half[j];
			const i1 = half[j + 1];
			testLayer.line(polys[p][i0], polys[p][i1])
				.strokeWidth(0.02)
				.stroke(i === 0 ? "#e53" : "#37b");
		}
	}));
	const top_points = top_indices
		.map((index, i) => polys[i][index]);
	const bottom_points = bottom_indices
		.map((index, i) => polys[i][index]);
	top_points.forEach(pt => testLayer.circle(pt).radius(0.05).fill("#fb4"));
	bottom_points.forEach(pt => testLayer.circle(pt).radius(0.05).fill("#9c4"));
	polys_l_r.forEach((p, i) => testLayer.circle(top_points[p])
		.radius(0.02).fill(i === 0 ? "#e53" : "#37b"))
	testLayer.polyline(zipper_points).fill("none").stroke("#fb4");
	intersections.forEach(pt => testLayer.circle(pt).radius(0.05).fill("#fb4"));
	return [];
};

svg.controls(20)
	.svg(() => controlsLayer.circle().radius(svg.getHeight() / 40).fill("#000"))
	.position((_, i, arr) => [
		Math.random() + (i < arr.length / 2 ? 0 : 1),
		Math.random()
	])
	.onChange((point, i, points) => {
		const hull1 = ear.math.convexHull(points.slice(0, points.length / 2)).map(p => [p[0], p[1]]);
		const hull2 = ear.math.convexHull(points.slice(points.length / 2, points.length)).map(p => [p[0], p[1]]);
		poly1.setPoints(hull1);
		poly2.setPoints(hull2);
		console.log(hull1, hull2);
		// polyFill1.setPoints(hull1);
		// polyFill2.setPoints(hull2);
		// const polygon = intersect_convex_polygons(hull1, hull2);
		const polygon = clip(hull1, hull2);
		poly3.setPoints(polygon);
	}, true);
