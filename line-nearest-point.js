var nearestPointCallback;

svg.size(300, 150)
	.fill("white")
	.stroke("black")
	.strokeWidth(4);

const colors = ["#fb4", "#158", "#e53"];
const boundary = ear.rect(svg.getWidth(), svg.getHeight()).scale(100);
const points = colors.map(() => [0, 1].map(() => [
	Math.random() * svg.getWidth(),
	Math.random() * svg.getHeight()
]));
const lines = [ear.line.fromPoints, ear.ray.fromPoints, ear.segment]
	.map((f, i) => f(...points[i]));

lines.map(line => boundary.clip(line))
	.map((seg, i) => svg.line(seg[0], seg[1]).stroke(colors[i]));
const layer = svg.g();

const update = (point) => {
  layer.removeChildren();
  const nears = lines.map(e => e.nearestPoint(point));
  nears.map(p => layer.line(p, point)
    .stroke("#fb4")
    .strokeLinecap("round")
    .strokeDasharray("0.1 8"));
  nears.map(p => layer.circle(p, 6));
  if (nearestPointCallback != null) {
    nearestPointCallback({ mouse: point });
  }
};

update([svg.getWidth() / 2, svg.getHeight() / 2]);

svg.onMove = update
