svg.size(2, 1)
	.padding(0.1)
	.strokeWidth(svg.getHeight() / 50)
	.strokeLinecap("round");

const colors = ["#fb4", "#158", "#e53"];

const hull1 = ear.math.convexHull(Array.from(Array(20))
	.map(() => [Math.random(), Math.random()]));
const hull2 = ear.math.convexHull(Array.from(Array(20))
	.map(() => [Math.random() + 1, Math.random()]));
const polygon1 = ear.polygon(hull1);
const polygon2 = ear.polygon(hull2);

const backLines = colors.map(c => svg.line().stroke(c).strokeDasharray("0.0001 0.075"));
polygon1.svg().appendTo(svg).fill("white").stroke("black");
polygon2.svg().appendTo(svg).fill("white").stroke("black");

const layer = svg.g();

svg.controls(6)
  .svg((_, i) => svg.circle(svg.getHeight() / 20).fill(colors[Math.floor(i / 2)]))
  .position(() => [2 * Math.random(), Math.random()])
  .onChange((p, i, points) => {
    layer.removeChildren();
    const lines = [
		  ear.line.fromPoints(points[0], points[1]),
		  ear.ray.fromPoints(points[2], points[3]),
		  ear.segment(points[4], points[5])
    ];
		// draw the background dotted lines
		const boundary = ear.rect(1, 1).scale(20);
    lines.forEach((el, i) => {
      const seg = boundary.clip(el);
      if (!seg) { return; }
      backLines[i].setPoints(seg[0], seg[1]);
    });
		// draw the clipped lines / rays / segments
		[polygon1, polygon2].forEach(polygon => {
      lines.forEach((el, i) => {
        const seg = polygon.clip(el);
        if (!seg) { return; }
        layer.line(seg[0], seg[1]).stroke(colors[i]);
      })
		});
	}, true);
