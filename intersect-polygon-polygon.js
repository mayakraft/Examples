svg.size(1.5, 1)
	.padding(0.05)
	.strokeWidth(svg.getHeight() / 100);

const poly1 = svg.polygon().fill("none").stroke("black");
const poly2 = svg.polygon().fill("none").stroke("black");
const poly3 = svg.polygon().fill("#fb4").stroke("black");
const controlsLayer = svg.g();
const testLayer = svg.g();

svg.controls(16)
	.svg(() => controlsLayer.circle().radius(svg.getHeight() / 40).fill("#000"))
	.position((_, i, arr) => [
		Math.random() + (i < arr.length / 2 ? 0 : 0.5),
		Math.random()
	])
	.onChange((point, i, points) => {
		const hull1 = ear.math.convex_hull(points.slice(0, points.length / 2)).map(p => [p[0], p[1]]);
		const hull2 = ear.math.convex_hull(points.slice(points.length / 2, points.length)).map(p => [p[0], p[1]]);
		poly1.setPoints(hull1);
		poly2.setPoints(hull2);
		const polygon = ear.math.intersect_polygon_polygon(hull1, hull2);
		poly3.setPoints(polygon);
	}, true);
