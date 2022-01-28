const epsilon = 0.2;

svg.size(2, 1)
	.padding(0.05)
	.strokeWidth(svg.getHeight() / 50);

// const polyEpsilon1 = svg.polygon().stroke("#edb").strokeLinejoin("round").strokeWidth(epsilon);
// const polyEpsilon2 = svg.polygon().stroke("#edb").strokeLinejoin("round").strokeWidth(epsilon);
const polyFill1 = svg.polygon().stroke("none");
const polyFill2 = svg.polygon().stroke("none");
const poly1 = svg.polygon().fill("none").stroke("black");
const poly2 = svg.polygon().fill("none").stroke("black");

svg.controls(20)
  .svg(() => svg.circle().radius(svg.getHeight() / 40)
		.fill("#000"))
  .position((_, i) => [
		Math.random() + (i < 20 / 2 ? 0 : 1),
		Math.random()
	])
  .onChange((point, i, points) => {
		const hull1 = ear.math.convex_hull(points.slice(0, points.length / 2));
		const hull2 = ear.math.convex_hull(points.slice(points.length / 2, points.length));
		poly1.setPoints(hull1);
		poly2.setPoints(hull2);
		polyFill1.setPoints(hull1);
		polyFill2.setPoints(hull2);
		// polyEpsilon1.setPoints(hull1);
		// polyEpsilon2.setPoints(hull2);
		const overlap = ear.math.overlap_convex_polygons(hull1, hull2);//, epsilon);
		polyFill1.fill(overlap ? "#e53" : "#158");
		polyFill2.fill(overlap ? "#e53" : "#158");
  }, true);
