svg.size(2, 1)
	.padding(0.1)
	.strokeWidth(svg.getHeight() / 50)
	.strokeLinecap("round");

const colors = ["#fb4", "#158", "#e53"];

const hull1 = ear.math.convex_hull(Array.from(Array(20))
	.map(() => [Math.random(), Math.random()]));
const hull2 = ear.math.convex_hull(Array.from(Array(20))
	.map(() => [Math.random() + 1, Math.random()]));
const polygon1 = ear.polygon(hull1);
const polygon2 = ear.polygon(hull2);

const backLine = svg.line().stroke(colors[0]).strokeDasharray("0.0001 0.075");
const backRay = svg.line().stroke(colors[1]).strokeDasharray("0.0001 0.075");
const backSegment = svg.line().stroke(colors[2]).strokeDasharray("0.0001 0.075");

polygon1.svg().appendTo(svg).fill("white").stroke("black");
polygon2.svg().appendTo(svg).fill("white").stroke("black");

const layer = svg.g();

svg.controls(6)
  .svg((_, i) => svg.circle(svg.getHeight() / 20).fill(colors[Math.floor(i / 2)]))
  .position(() => [2 * Math.random(), Math.random()])
  .onChange((p, i, points) => {
    layer.removeChildren();
		const line = ear.line.fromPoints(points[0], points[1]);
		const ray = ear.ray.fromPoints(points[2], points[3]);
		const segment = ear.segment(points[4], points[5]);
		// draw the background dotted lines
		const boundary = ear.rect(1, 1).scale(20);
		const backLinePts = boundary.clipLine(line);
		const backRayPts = boundary.clipRay(ray);
		const backSegmentPts = boundary.clipSegment(segment);
		if (backLinePts) {
			backLine.setPoints(backLinePts[0], backLinePts[1])
		}
		if (backRayPts) {
			backRay.setPoints(backRayPts[0], backRayPts[1])
		}
		if (backSegmentPts) {
			backSegment.setPoints(backSegmentPts[0], backSegmentPts[1])
		}
		// draw the clipped lines / rays / segments
		[polygon1, polygon2].forEach(polygon => {
			const clipLine = polygon.clipLine(line);
			const clipRay = polygon.clipRay(ray);
			const clipSegment = polygon.clipSegment(segment);
			if (clipLine) { layer.line(clipLine[0], clipLine[1]).stroke(colors[0]); }
			if (clipRay) { layer.line(clipRay[0], clipRay[1]).stroke(colors[1]); }
			if (clipSegment) { layer.line(clipSegment[0], clipSegment[1]).stroke(colors[2]); }
		});
	}, true);

