var callback;

// const color = "#555";
// const colordarker = "#222";
const color = "#eee";
const colordarker = "#aaa";

// quadrants as integers: 0, 1, 2, 3, for angles between -PI and PI
const quadrant = angle => angle > 0
  ? (angle < Math.PI / 2 ? 0 : 1)
  : (angle < -Math.PI / 2 ? 2 : 3);

const arcToX = (vec) => {
  const a = Math.atan2(vec.y, vec.x);
  return [0, a, Math.PI, a, 0].slice(quadrant(a), quadrant(a)+2);
};

svg.size(-1.5, -1.5, 3, 3);

const strokeWidth = 0.05;
const dashArray = `${strokeWidth} ${strokeWidth * 2}`;
const dotArray = `${strokeWidth / 100} ${strokeWidth * 2}`;

svg.strokeWidth(strokeWidth);
const gridLayer = svg.g().stroke(color).strokeLinecap("round");
const drawLayer = svg.g()
  .strokeLinecap("round")
  .fontFamily("Avenir Next, Helvetica, Arial, Noto Sans")
  .fontWeight("700")
  .fontSize("0.28px");
drawLayer.setAttribute("text-anchor", "middle");
drawLayer.setAttribute("user-select", "none");
const dotLayer = svg.g();

for (let i = -12; i <= 12; i += 1) {
  const s = i;
  gridLayer.line(s, -svg.getHeight() * 4, s, svg.getHeight() * 4);
  gridLayer.line(-svg.getWidth() * 4, s, svg.getWidth() * 4, s);
}
[[svg.getWidth() * 10, 0], [0, svg.getHeight() * 10], [-svg.getWidth() * 10, 0], [0, -svg.getHeight() * 10]]
  .forEach(pts => gridLayer.line(0, 0, ...pts)
    .strokeDasharray(dotArray)
    .stroke(colordarker));

const onChange = function (point, i, points) {
  const v = ear.vector(point);
  const normalized = v.normalize();
  drawLayer.removeChildren();
  drawLayer.line(v.x, v.y, v.x, 0).stroke("#fb4").strokeDasharray(dotArray);
  drawLayer.line(v.x, v.y, 0, v.y).stroke("#fb4").strokeDasharray(dotArray);
  drawLayer.line(0, 0, v.x, 0).stroke("#e53");
  drawLayer.line(0, 0, 0, v.y).stroke("#e53");
  drawLayer.line(0, 0, v.x, v.y).stroke("#fb4").strokeDasharray(dotArray);
  drawLayer.line(0, 0, normalized.x, normalized.y).stroke("#158");
  drawLayer.arc(0, 0, normalized.magnitude(), ...arcToX(normalized))
    .fill("none")
    .stroke("#158")
    .strokeDasharray(dashArray);

  // text
  const nudgeX = v.y > 0 ? -0.15 : 0.35;
  const nudgeY = v.x > 0 ? -0.6 : 0.6;
  const nudgeNorm = v.y > 0 ? 0.3 : -0.1;
  drawLayer.text(`X ${v.x.toFixed(1)}`, v.x, nudgeX).fill("#e53");
  drawLayer.text(`Y ${v.y.toFixed(1)}`, nudgeY, v.y + 0.05).fill("#e53");
  const normString = `(${normalized.x.toFixed(1)}, ${normalized.y.toFixed(1)})`;
  drawLayer.text(normString, normalized.x, normalized.y + nudgeNorm).fill("#158");

  if (callback != null) {
    callback({ vector: points[0], normalized });
  }
};

svg.controls(1)
  .svg(() => dotLayer.circle().radius(0.12).fill("#e53"))
  .position(() => [0,1].map(() => Math.random() < 0.5 ? -1.2 : 1.2))
  .onChange(onChange, true);

