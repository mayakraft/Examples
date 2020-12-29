const EPSILON = 0.2;

const { subtract, parallel, point_on_line, point_in_convex_poly_inclusive, point_in_convex_poly_exclusive, intersect_lines,
  include_l,
  include_r,
  include_s,
  exclude_l,
  exclude_r,
  exclude_s,
} = ear.math;

const fn_not_undefined = a => a !== undefined;

const intersect_line_seg_include = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  include_l,
  include_s,
  ep
);
const intersect_line_seg_exclude = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  exclude_l,
  exclude_s,
  ep
);
const intersect_ray_seg_include = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  include_r,
  include_s,
  ep
);
const intersect_ray_seg_exclude = (vector, origin, pt0, pt1, ep = EPSILON) => intersect_lines(
  vector, origin,
  subtract(pt1, pt0), pt0,
  exclude_r,
  exclude_s,
  ep
);
const intersect_seg_seg_include = (a0, a1, b0, b1, ep = EPSILON) => intersect_lines(
  subtract(a1, a0), a0,
  subtract(b1, b0), b0,
  include_s,
  include_s,
  ep
);
const intersect_seg_seg_exclude = (a0, a1, b0, b1, ep = EPSILON) => intersect_lines(
  subtract(a1, a0), a0,
  subtract(b1, b0), b0,
  exclude_s,
  exclude_s,
  ep
);

// equivalency test for 2d-vectors
const quick_equivalent_2 = (a, b, ep = EPSILON) => Math.abs(a[0] - b[0]) < ep
  && Math.abs(a[1] - b[1]) < ep;

const get_unique_pair = (intersections, epsilon = EPSILON) => {
  for (let i = 1; i < intersections.length; i += 1) {
    if (!quick_equivalent_2(intersections[0], intersections[i], epsilon)) {
      return [intersections[0], intersections[i]];
    }
  }
};

const get_unique_points = (points, epsilon = EPSILON) => {
  const unique = [];
  for (let i = 0; i < points.length; i += 1) {
    let match = false;
    for (let j = 0; j < unique.length; j += 1) {
      if (quick_equivalent_2(points[i], unique[j], epsilon)) {
        match = true;
      }
    }
    if (!match) { unique.push(points[i]); }
  }
  return unique;
};

const sortPointsAlongVector = (points, vector) => points
  .map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
  .sort((a, b) => a.d - b.d)
  .map(a => a.point);

const clip_intersections = (intersect_func, poly, line1, line2, epsilon = EPSILON) => poly
  .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segments
  .map(el => intersect_func(line1, line2, el[0], el[1], epsilon))
  .filter(fn_not_undefined);

// convert segments to vector origin
const collinear_check = (poly, vector, origin) => {
  const polyvecs = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // poly points into segments
    .map(seg => subtract(...seg));
  return polyvecs
    .map((vec, i) => parallel(vec, vector) ? i : undefined)
    .filter(fn_not_undefined) // filter only sides that are parallel
    .map(i => point_on_line(origin, polyvecs[i], poly[i])) // is the point along edge
    .reduce((a, b) => a || b, false);
};

const clip_segment_func = (poly, seg0, seg1, epsilon = EPSILON) => {
  const seg = [seg0, seg1];
  // if both endpoints are inclusive inside the polygon, return original segment
  const inclusive_inside = seg
    .map(s => point_in_convex_poly_inclusive(s, poly, epsilon));
  if (inclusive_inside[0] === true && inclusive_inside[1] === true) {
    return [[...seg0], [...seg1]];
  }
  // clip segment against every polygon edge
  const clip_inclusive = clip_intersections(intersect_seg_seg_include, poly, seg0, seg1, epsilon);
  // const clip_inclusive_unique = get_unique_pair(clip_inclusive, epsilon * 2);
  // // if the number of unique points is 2 or more (2), return this segment.
  // // this only works in the exclusive case because we already removed cases
  // // where the segment is collinear along an edge of the polygon.
  // if (clip_inclusive_unique) {  // 3 or 4
  //   return clip_inclusive_unique;
  // }
  const clip_inclusive_unique = get_unique_points(clip_inclusive, epsilon * 2);
  if (clip_inclusive_unique) {
    if (clip_inclusive_unique.length === 2) {
      return clip_inclusive_unique;
    } else if (clip_inclusive_unique.length > 2) {
      const sorted = sortPointsAlongVector(clip_inclusive_unique, subtract(seg1, seg0));
      return [sorted[0], sorted[sorted.length - 1]];
    }
  }
  // if we have one unique intersection point, combine it with whichever segment
  // point is inside the polygon, and if none are inside it means the segment
  // intersects with a point along the outer edge, and we return undefined.
  if (clip_inclusive.length > 0) {
    const exclusive_inside = seg
      .map(s => point_in_convex_poly_exclusive(s, poly, epsilon));
    if (exclusive_inside[0] === true) {
      return [[...seg0], clip_inclusive[0]];
    }
    if (exclusive_inside[1] === true) {
      return [[...seg1], clip_inclusive[0]];
    }
  }
};

const clip_segment_in_convex_poly_inclusive = (poly, seg0, seg1, epsilon = EPSILON) => {
  return clip_segment_func(poly, seg0, seg1, epsilon);
};

const clip_segment_in_convex_poly_exclusive = (poly, seg0, seg1, epsilon = EPSILON) => {
  const segVec = subtract(seg1, seg0);
  if (collinear_check(poly, segVec, seg0)) {
    return undefined;
  }
  return clip_segment_func(poly, seg0, seg1, epsilon);
};






svg.size(-1.33, -1.33, 2.66, 2.66);

const strokeWidth = svg.getWidth()*0.015;
const radius = strokeWidth * 1.5;
const polygon = ear.polygon([1,0], [0,1], [-1,0], [0,-1]);

svg.strokeWidth(strokeWidth).strokeLinecap("round");

const svgPolygon = polygon.svg()
  .appendTo(svg)
  .fill("white")
  .stroke("none");

const back = svg.g();

const svgLine = svg.line()
  .stroke("#fb4")
  .strokeDasharray(`${strokeWidth / 100} ${strokeWidth * 2}`);
const svgPolyLines = polygon.sides.map(side => svg.line(side[0], side[1])
  .stroke("black"));

const layer = svg.g();

const svgPolyPoints = polygon.points.map(p => svg.circle(p)
  .radius(radius)
  .fill("white")
  .stroke("black"));

const touchLayer = svg.g();

polygon.sides.map(side => back.line(side[0], side[1])
  .strokeWidth(EPSILON*2)
  .stroke("#e5e5e5"));
polygon.forEach(p => back.circle(p).radius(EPSILON).fill("#ccc"));

svg.controls(2)
  .svg(() => touchLayer.circle().radius(radius).fill("white").strokeWidth(strokeWidth).stroke("black"))
  .position(() => [svg.getWidth(), svg.getHeight()]
    .map(l => l * (Math.random() - 0.5)))
  .onChange((p, i, points) => {
    const segment = ear.segment(...points);
    svgLine.setPoints(points);
    layer.removeChildren();

    // reset colors
    svgPolyPoints.forEach(point => point.stroke("black").fill("white"));
    svgPolyLines.forEach(line => line.stroke("black"));

    // polygon points
    polygon
      .map(p => ear.math.point_on_segment_inclusive(p, ...points, EPSILON))
      .map((onSeg, i) => onSeg ? i : undefined)
      .filter(a => a !== undefined)
      .map(i => svgPolyPoints[i])
      .forEach(point => point.stroke("#e53"));
    polygon
      .map(p => ear.math.point_on_segment_exclusive(p, ...points, EPSILON))
      .map((onSeg, i) => onSeg ? i : undefined)
      .filter(a => a !== undefined)
      .map(i => svgPolyPoints[i])
      .forEach(point => point.fill("#e53"));

    // segment points
    const points_in_exclusive = [segment[0], segment[1]]
      .map(point => ear.math.point_in_convex_poly_exclusive(point, polygon, EPSILON));
    const points_in_inclusive = [segment[0], segment[1]]
      .map(point => ear.math.point_in_convex_poly_inclusive(point, polygon, EPSILON));
    points_in_exclusive.forEach((inside, i) => points[i].svg.fill(inside ? "#e53" : "white"));
    points_in_inclusive.forEach((inside, i) => points[i].svg.stroke(inside ? "#e53" : "black"));

    // sides
    // intersects
    const intersect_exclude = polygon.sides
      .map(side => ear.math.intersect_lines(ear.math.subtract(side[1], side[0]), side[0], segment.vector, segment.origin, ear.math.exclude_s, ear.math.exclude_s, EPSILON));
    const intersect_include = polygon.sides
      .map(side => ear.math.intersect_lines(ear.math.subtract(side[1], side[0]), side[0], segment.vector, segment.origin, ear.math.include_s, ear.math.include_s, EPSILON));
    // collinear
    const collinear_inclusive = polygon.sides
      .map(side => [segment[0], segment[1]]
        .map(p => ear.math.point_on_segment_inclusive(p, side[0], side[1], EPSILON)));
    const collinear_exclusive = polygon.sides
      .map(side => [segment[0], segment[1]]
        .map(p => ear.math.point_on_segment_exclusive(p, side[0], side[1], EPSILON)));

    intersect_include.forEach((sect, i) => {
      if (sect) {
        svgPolyLines[i].stroke("#158");
        layer.circle(sect).radius(radius*1.5).fill("#158");
      }
    });

    intersect_exclude.forEach((sect, i) => {
      if (sect) {
        svgPolyLines[i].stroke("#e53");
        layer.circle(sect).radius(radius).fill("#e53");
      }
    });

    collinear_inclusive.forEach((pair, i) => pair.forEach((onSeg, j) => {
      if (onSeg) {
        layer.line(polygon.sides[i][0], polygon.sides[i][1])
          .stroke("#fb4")
          .strokeWidth(strokeWidth * 1.5)
          .strokeDasharray("0.0001 0.2");
      }
    }));

    collinear_exclusive.forEach((pair, i) => pair.forEach((onSeg, j) => {
      if (onSeg) {
        layer.line(polygon.sides[i][0], polygon.sides[i][1])
          .stroke("#e53")
          .strokeWidth(strokeWidth * 1.5)
          .strokeDasharray("0.0001 0.2")
          .strokeDashoffset("0.1");
      }
    }));

    // polygon.sides
    //   .map(side => ({
    //     overlap: ear.math.overlap_segment_segment_exclusive(...points, ...side, EPSILON),
    //     collinear: ear.math.collinear_segment_segment_exclusive(...points, ...side, EPSILON),
    //   }))
    //   .forEach((el, i) => svgPolyLines[i].stroke(el.overlap ? "#158" : (el.collinear ? "#e53" : "black")));
    const clip = clip_segment_in_convex_poly_exclusive(polygon, ...points, EPSILON);
    if (clip) {
      layer.line(...clip).stroke("#fb4");
    }
    const intersections = polygon.intersect(ear.segment(points));
    if (intersections) {
    }
  }, true);



// collinear_line_line_inclusive(aV, aP, bV, bP, epsilon);
// collinear_line_ray_inclusive(aV, aP, bV, bP, epsilon);
// collinear_line_segment_inclusive(aV, aP, b0, b1, epsilon);
// collinear_ray_ray_inclusive(aV, aP, bV, bP, epsilon);
// collinear_ray_segment_inclusive(aV, aP, b0, b1, epsilon);
// collinear_segment_segment_inclusive(a0, a1, b0, b1, epsilon);
// collinear_line_line_exclusive(aV, aP, bV, bP, epsilon);
// collinear_line_ray_exclusive(aV, aP, bV, bP, epsilon);
// collinear_line_segment_exclusive(aV, aP, b0, b1, epsilon);
// collinear_ray_ray_exclusive(aV, aP, bV, bP, epsilon);
// collinear_ray_segment_exclusive(aV, aP, b0, b1, epsilon);
// collinear_segment_segment_exclusive(a0, a1, b0, b1, epsilon);
