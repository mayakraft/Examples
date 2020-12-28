const { subtract, magnitude, mag_squared, cross2, dot } = ear.math;

const EPSILON = 0.5;

const include_l = () => true;
const include_r = (t, e=EPSILON) => t > -e;
const include_s = (t, e=EPSILON) => t > -e && t < 1 + e;
const exclude_l = () => true;
const exclude_r = (t, e=EPSILON) => t > e;
const exclude_s = (t, e=EPSILON) => t > e && t < 1 - e;

const collinear = (point, vector, origin, compFunc, epsilon = EPSILON) => {
  const p2p = subtract(point, origin);
  const lineMagSq = mag_squared(vector);
  // const p2pMagSq = mag_squared(p2p);
  const p2pMag = magnitude(p2p);
  // const p2pMagHalf = magnitude(p2p) * 2;
  // if (p2pMagSq < epsilon) { console.log("early exit"); return compFunc(p2pMagSq, epsilon); }
  if (p2pMag < epsilon) { console.log("early exit"); return compFunc(p2pMag, epsilon); }
  if (Math.sqrt(lineMagSq) < epsilon) { return false; }
  const cross = cross2(p2p, vector);
  const proj = dot(p2p, vector) / lineMagSq;
  return Math.abs(cross) < epsilon && compFunc(proj, epsilon);
};

const point_on_ray_inclusive = (point, vector, origin, epsilon = EPSILON) => collinear(point, vector, origin, include_r, epsilon);
const point_on_ray_exclusive = (point, vector, origin, epsilon = EPSILON) => collinear(point, vector, origin, exclude_r, epsilon);


const radius = EPSILON / 4;
svg.size(6, 6);
svg.background("#edb")

const bottom = svg.g().stroke("none").fill("white")
const top = svg.g();

svg.line(0.5, 0.5, 0.5 + EPSILON, 0.5).stroke("black").strokeWidth(radius/4);
svg.line(0.5, 0.45, 0.5, 0.55).stroke("black").strokeWidth(radius/4);
svg.line(0.5 + EPSILON, 0.45, 0.5 + EPSILON, 0.55).stroke("black").strokeWidth(radius/4);
svg.text("epsilon", 0.5, 0.5-0.2).fontSize(0.3);

colors = ["#158", "#158"];

const boundary = ear.polygon(
  [100, 100],
  [-100, 100],
  [-100, -100],
  [100, -100],
);

const segments = Array.from(Array(2))
  .map((_, i) => [[1.5, 3*i + 1.5], [4.5, 3*i + 1.5]]);

const lines = [
  ear.ray.fromPoints,
  ear.ray.fromPoints,
].map((f, i) => f(segments[i]));

const svgLines = ["clipRay", "clipRay"]
  .map((key, i) => boundary[key](lines[i]))
  .map((seg, i) => top.line(seg[0], seg[1]).stroke(colors[i]).strokeWidth(radius/2));

const svgPoints = segments.map((seg, i) => [
  top.circle(seg[0]).radius(radius).fill(colors[i]),
  top.circle(seg[1]).radius(radius).fill(colors[i]),
]).reduce((a, b) => a.concat(b), []);

[2, 3].forEach(i => svgPoints[i]
  .fill("#edb")
  .strokeWidth(radius/2)
  .stroke(colors[parseInt(i/2)]));

const funcs = [
  point_on_ray_inclusive,
  point_on_ray_exclusive,
];

const args = [
  [lines[0].vector, lines[0].origin],
  [lines[1].vector, lines[1].origin],
];

bottom.circle(segments[0][0]).radius(EPSILON);
bottom.circle(segments[1][0]).radius(EPSILON)
  .fill("none")
  .strokeWidth(radius/2)
  .strokeDasharray(radius/2)
  .stroke("black");
bottom.rect(
  segments[0][0][0],
  segments[0][0][1] - EPSILON / 4 * 1.414,
  segments[0][1][0] - segments[0][0][0],
  EPSILON / 2 * 1.414
);

svg.controls(1)
  .position(() => [3, 3])
  .svg(() => top.circle().radius(radius).fill("black"))
  .onChange((point) => {
    const point_on = funcs.map((f, i) => f(point, ...args[i], EPSILON));
    const any = point_on.reduce((a, b) => a || b, false);
    point.svg.fill(any ? "#e53" : "black");
  });
