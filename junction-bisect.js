svg.size(-250, -250, 500, 500);

const color = "black";
// const color = "#999";
const colors = ["#fb4", "#158", "#e53"];

const vmin = (svg.getWidth() > svg.getHeight()
  ? svg.getHeight()
  : svg.getWidth());

const onChange = function (point, i, points) {
  const vectors = ear.math
    .counterClockwiseOrder2(points)
    .map(i => points[i]);
  const angles = vectors.map(v => Math.atan2(v[1], v[0]));
  const bisections = vectors
    .map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
    .map(vecs => ear.math.counterClockwiseBisect2(...vecs));
	const radii = ear.math.counterClockwiseSectors2(vectors)
  // const radii = ear.math.interior_angles(...vectors)
    .map(angle => vmin * 0.4 - ((angle / (Math.PI * 2)) ** 0.5) * vmin * 0.25);
  // draw
  svg.removeChildren();
  angles.map((_, i, arr) => [angles[i], angles[(i + 1) % arr.length]])
    .map((pair, i) => svg.wedge(0, 0, radii[i], ...pair).fill(colors[i % 3]));
  const r2 = vmin * 0.45;
  // dots
  bisections
    .map(ear.math.normalize)
    .map(v => ear.math.scale(v, r2))
    .map(p => svg.circle(p[0], p[1], 10).fill(color));
  // black lines
  points.map(c => svg.line(0, 0, c[0], c[1])
    .stroke(color)
    .strokeWidth(6)
    .strokeLinecap("round"));
};

svg.controls(3)
  .position(() => {
    const angle = Math.random() * Math.PI * 2;
    return [Math.cos, Math.sin]
      .map(f => f(angle))
      .map(n => n * vmin * 0.4);
  })
  .onChange(onChange, true)
  .forEach((p) => {
    p.updatePosition = (mouse) => [Math.cos, Math.sin]
      .map(f => f(Math.atan2(mouse.y, mouse.x)))
      .map(n => n * vmin * 0.4);
  });
