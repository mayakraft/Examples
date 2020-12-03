svg.size(500, 500);

const colors = ["#158", "#fb4"];
const STROKE_WIDTH = svg.getWidth() * 0.0125;
const RADIUS = svg.getWidth() * 0.025;

const paperLayer = svg.g()
  .stroke("black")
  .strokeLinejoin("bevel")
  .strokeWidth(STROKE_WIDTH);
const topLayer = svg.g();

const hullPoints = Array.from(Array(24)).map(() => {
  const a = Math.random() * Math.PI * 2;
  const r = Math.random() * svg.getHeight() * 0.5;
  return [
    svg.getWidth() * 0.5 + r * Math.cos(a),
    svg.getHeight() * 0.5 + r * Math.sin(a)
  ];
});

const hull = ear.polygon.convexHull(hullPoints);

const onChange = (p, i, points) => {
  paperLayer.removeChildren();

  const vec = ear.math.subtract(points[1], points[0]);
  const polys = hull.split(vec, points[0]);

  if (polys == null) { return; }
  polys.sort((a, b) => b.area() - a.area());

  if (polys.length > 1) {
    const matrix = ear.matrix().reflectZ(vec, points[0]);
    const reflectedPoints = polys[1]
      .map(p => matrix.transform(p))
      .map(p => [p[0], p[1]]);
    polys[1] = ear.polygon(reflectedPoints);
  }
  polys.forEach((p, i) => paperLayer.polygon(p)
    .fill(colors[i % 2]));
};

svg.controls(2)
  .svg(() => topLayer.circle().radius(RADIUS).fill("#e53"))
  .position((_, i) => (i === 0
    ? [svg.getWidth() * 0.5, svg.getHeight() * 0.5]
    : [Math.random() * svg.getWidth(), Math.random() * svg.getHeight()]))
  .onChange(onChange, true);
