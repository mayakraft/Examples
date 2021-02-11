svg.size(1, 1)
	.strokeWidth(svg.getHeight() / 50)
	.strokeLinecap("round");

const points = Array.from(Array(20))
	.map(() => [Math.random(), Math.random()]);
const hull = ear.math.convex_hull(points);
const polygon = ear.polygon(hull);

const backLine = svg.line()
	.stroke("#e53")
	.strokeLinecap("round")
	.strokeDasharray("0.0001 0.1");

const svgPolygon = polygon.svg()
  .appendTo(svg)
  .fill("white")
  .stroke("black");

const layer = svg.g();

svg.controls(2)
  .svg(() => svg.circle(svg.getHeight() / 20).fill("#e53"))
  .position(() => [Math.random(), Math.random()])
  .onChange((p, i, points) => {
    layer.removeChildren();
		const line = ear.line.fromPoints(...points);
		const backSeg = ear.rect(1, 1).scale(20).clip(line);
		if (backSeg) {
			backLine.setPoints(backSeg[0], backSeg[1])
		}
		const segment = polygon.clip(line);
		if (segment) {
			layer.line(segment[0], segment[1]).stroke("#fb4");
  	}
	}, true);

