var callback;

svg.size(100, 100);

const strokeWidth = svg.getWidth() / 30;
svg.strokeWidth(strokeWidth);

const arrowhead = svg.marker()
  .orient("auto-start-reverse")
  .refY(0.5)
  .markerWidth(4)
  .markerHeight(4);
arrowhead.setAttribute("viewBox", "0 0 1 1");
const arrowheadPoly = arrowhead.polygon(0, 0, 0, 1, 0.866, 0.5)
  .fill("black")
  .stroke("none");

const colors = ["#fb4", "#e53"];
const svgLines = ["black", "black"].map(c => svg.line().stroke(c));
const arrowLayer = svg.g()
  .strokeWidth(strokeWidth / 2)
  .strokeDasharray(`${strokeWidth} ${strokeWidth / 2}`);
const lineLayer = svg.g();

const boundary = ear.polygon([-1, -1], [1, -1], [1, 1], [-1, 1])
  .scale(1000);

const redraw = (p, i, points) => {
  lineLayer.removeChildren();
  arrowLayer.removeChildren();
  const lines = [0, 1]
    .map(i => ear.line.fromPoints(points[i * 2], points[i * 2 + 1]));
  lines.map(l => boundary.clip(l))
    .forEach((s, i) => svgLines[i].setPoints(s[0], s[1]));
  const bisect = lines[0].bisect(lines[1], 0.01);
  bisect
		.map((l, i) => ({ s: boundary.clip(l), c: colors[i % 2] }))
    .filter(el => el.s !== undefined)
    .map(el => lineLayer.line(el.s[0], el.s[1]).stroke(el.c));

  const arrowColor = (lines[1].vector.dot(lines[0].vector) > 0)
    ? colors[0]
    : colors[1];
  arrowheadPoly.fill(arrowColor);
  arrowLayer.stroke(arrowColor);
  arrowLayer.line(points[0], points[1]).markerEnd(arrowhead);
  arrowLayer.line(points[2], points[3]).markerEnd(arrowhead);
	if (callback) {
		callback({ bisect });
	}
};

const nudge = svg.getWidth() / 4;
const pos = [
  [svg.getWidth() * 0.5 - nudge, svg.getHeight() * 1 / 5],
  [svg.getWidth() * 0.5 + nudge, svg.getHeight() * 1 / 5],
  [svg.getWidth() * 0.5 - nudge, svg.getHeight() * 4 / 5],
  [svg.getWidth() * 0.5 + nudge, svg.getHeight() * 4 / 5],
];

svg.controls(4)
  .position((_, i) => pos[i])
  .onChange(redraw, true);

