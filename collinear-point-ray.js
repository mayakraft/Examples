const { subtract, normalize, magnitude, mag_squared, cross2, dot } = ear.math;

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
  // is the line degenerate?
  if (Math.sqrt(lineMagSq) < epsilon) { return false; }
  const lineMag = Math.sqrt(lineMagSq);
  const cross = cross2(p2p, vector.map(n => n / lineMag));
  const proj = dot(p2p, vector) / lineMag;
  return Math.abs(cross) < epsilon && compFunc(proj, epsilon);
};

const point_on_ray_inclusive = (point, vector, origin, epsilon = EPSILON) => collinear(point, vector, origin, include_r, epsilon);
const point_on_ray_exclusive = (point, vector, origin, epsilon = EPSILON) => collinear(point, vector, origin, exclude_r, epsilon);


const radius = EPSILON / 4;
svg.size(6, 6);
svg.background("#edb");

const bottom = svg.g().stroke("none").fill("white");
const top = svg.g();

// Epsilon key
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

const pointPositions = Array.from(Array(2))
  .map((_, i) => [[1.5, 3*i + 1.5], [4.5, 3*i + 1.5]])
  .reduce((a, b) => a.concat(b), []).concat([[3, 3]]);

const stylePoints = (svg, i) => {
  if (i === 0 || i === 1) {
    svg.fill("#158");
  } else if (i === 2 || i === 3) {
    svg.fill("#edb")
      .strokeWidth(radius/2)
      .stroke(colors[parseInt(i/2)]);
  } else {
    svg.fill("black")
  }
  return svg;
}

svg.controls(5)
  .position((_, i) => pointPositions[i])
  .svg((_, i) => stylePoints(svg.circle().radius(radius), i))
  .onChange((point, i, points) => {
    bottom.removeChildren();
    top.removeChildren();
    const segments = Array.from(Array(2))
      .map((_, i) => [i * 2, i * 2 + 1])
      .map(indices => indices.map(i => points[i]));

    const lines = [
      ear.ray.fromPoints,
      ear.ray.fromPoints,
    ].map((f, i) => f(segments[i]));

    const clips = ["clipRay", "clipRay"]
      .map((key, i) => boundary[key](lines[i]));

    const svgLines = clips
      .map((seg, i) => top.line(seg[0], seg[1])
        .stroke(colors[i])
        .strokeWidth(radius/2));

    const sides = lines
      .map(line => line.vector.rotate90().normalize().scale(EPSILON));

    const endcap = [-1, 1]
      .map((s, i) => lines[i].vector.normalize().scale(s * EPSILON));

    sides.map((side, i) => bottom.polygon(
      side.add(endcap[i]).add(clips[i][0]),
      side.add(clips[i][1]),
      side.flip().add(clips[i][1]),
      side.flip().add(endcap[i]).add(clips[i][0]),
    ));

    if (i === 4) {
      const args = [
        [lines[0].vector, lines[0].origin],
        [lines[1].vector, lines[1].origin],
      ];
      const point_on = [point_on_ray_inclusive, point_on_ray_exclusive]
        .map((f, i) => f(point, ...args[i], EPSILON));
      const any = point_on.reduce((a, b) => a || b, false);
      point.svg.fill(any ? "#e53" : "black");
    }

  }, true);

