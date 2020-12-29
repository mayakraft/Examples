svg.size(-2, -1, 4, 2)
	.padding(0.25)
	.strokeWidth(svg.getHeight() / 50);

const circle = ear.circle(1);
circle.svg()
  .appendTo(svg)
  .stroke("black")
  .fill("none");
const svgLine = svg.line().stroke("#fb4");
const layer = svg.g();

svg.controls(2)
  .svg(() => svg.circle(svg.getHeight() / 15).fill("#e53"))
  .position((_, i) => [i === 0 ? -2 : 2, 0])
  .onChange((p, i, points) => {
    layer.removeChildren();
		svgLine.setPoints(points);
    const segment = ear.segment(...points);
    const intersections = circle.intersect(segment);
    if (intersections === undefined) { return; }
    intersections.map(i => layer
			.circle(i[0], i[1], svg.getHeight() / 20)
			.fill("#158"));
  }, true);

