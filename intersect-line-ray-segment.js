svg.size(500, 500);
const vmin = svg.getWidth() > svg.getHeight() ? svg.getHeight() : svg.getWidth();
const strokeWidth = vmin * 0.015;
const radius = strokeWidth * 2;
const wedgeRadius = strokeWidth * 4;
const wedgeSpace = strokeWidth * 2;
const colors = ["#fb4", "#158", "#e53"];

svg.strokeWidth(strokeWidth).strokeLinecap("round");
const xingLayer = svg.g();
const lines = [0, 1, 2].map(i => svg.line().stroke(colors[i % 3]));
const boundary = ear.polygon([
  [-svg.getWidth(), -svg.getHeight()],
  [svg.getWidth() * 3, -svg.getHeight()],
  [svg.getWidth() * 3, svg.getHeight() * 3],
  [-svg.getWidth(), svg.getHeight() * 3]
]);

const redraw = function (p, i, points) {
  const line = ear.line.fromPoints(points[0], points[1]);
  const ray = ear.ray.fromPoints(points[2], points[3]);
  const edge = ear.segment(points[4], points[5]);
  const segments = Array.from(Array(3)).map((_, i) => [
    [points[(i * 2) + 0].x, points[(i * 2) + 0].y],
    [points[(i * 2) + 1].x, points[(i * 2) + 1].y]
  ]);
  segments[0] = boundary.clip(line);
  segments[1] = boundary.clip(ray);
  segments.forEach((segment, i) => [0, 1].forEach((j) => {
    lines[i].setAttribute(`x${j + 1}`, segment[j][0]);
    lines[i].setAttribute(`y${j + 1}`, segment[j][1]);
  }));

  // intersection wedges
  xingLayer.removeChildren();
  const intersections = [
    { p: line.intersect(ray), v: [line, ray], c: ["#fb4", "#158"] },
    { p: ray.intersect(edge), v: [ray, edge], c: ["#158", "#e53"] },
    { p: edge.intersect(line), v: [edge, line], c: ["#e53", "#fb4"] }
  ].filter(xing => xing.p != null);

  intersections.forEach((xing) => {
    xing.vecs = [
      xing.v[0].vector.normalize(),
      xing.v[0].vector.normalize().flip(),
      xing.v[1].vector.normalize(),
      xing.v[1].vector.normalize().flip()];
  });
  intersections.forEach((xing) => {
    xing.angles = xing.vecs
      .map(vec => Math.atan2(vec[1], vec[0]))
      .sort((a, b) => a - b);
  });

  intersections
    .map(xing => xing.angles.map((_, i) => {
      const a = [xing.angles[i], xing.angles[(i + 1) % xing.angles.length]];
      const dp = ear.math.counter_clockwise_bisect2(
        [Math.cos(a[0]), Math.sin(a[0])],
        [Math.cos(a[1]), Math.sin(a[1])]
      );
      const lc = (i === 3) ? Math.PI * 2 : 0;
      const interior = ear.math.counter_clockwise_angle_radians(a[0], a[1] + lc);
      const r = wedgeSpace / (interior ** 0.866);
      const p = [xing.p[0] + dp[0] * r, xing.p[1] + dp[1] * r];
      return xingLayer.wedge(p[0], p[1], wedgeRadius, a[0], a[1])
        .fill(xing.c[i % 2]);
    })).reduce((a, b) => a.concat(b), []);
};

svg.controls(6)
  .svg((_, i) => ear.svg.circle().radius(radius).fill(colors[Math.floor(i / 2) % 3]))
  .position(() => [
    Math.random() * svg.getWidth() * 0.8 + svg.getWidth() * 0.1,
    Math.random() * svg.getHeight() * 0.8 + svg.getHeight() * 0.1
  ])
  .onChange(redraw, true);
