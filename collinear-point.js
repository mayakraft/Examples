const EPSILON = 0.5;
const radius = EPSILON / 2;

svg.size(10, 6);

const colors = ["#fb4", "#158", "#158", "#e53", "#e53", "black"];

const bottom = svg.g().stroke("none").fill("#edb");
const top = svg.g();

const pointPositions = Array.from(Array(5))
  .map((_, i) => [[i*2 + 1, 1], [i*2 + 1, 5]])
  .reduce((a, b) => a.concat(b), []).concat([[0, 3]]);

const stylePoints = (svg, i) => {
  svg.fill(colors[parseInt(i/2)])
  if (i === 4 || i === 8 || i === 9) {
    svg.fill("white")
      .strokeWidth(radius/2)
      .stroke(colors[parseInt(i/2)]);
  }
  return svg;
}

const boundary = ear.polygon(
  [100, 100],
  [-100, 100],
  [-100, -100],
  [100, -100],
);

const funcs = [
  ear.math.point_on_line,
  ear.math.point_on_ray_inclusive,
  ear.math.point_on_ray_exclusive,
  ear.math.point_on_segment_inclusive,
  ear.math.point_on_segment_exclusive,
];

svg.controls(11)
  .position((_, i) => pointPositions[i])
  .svg((_, i) => stylePoints(svg.circle().radius(radius), i))
  .onChange((point, i, points) => {
    bottom.removeChildren();
    top.removeChildren();
    
    const segments = Array.from(Array(5))
      .map((_, i) => [i * 2, i * 2 + 1])
      .map(indices => indices.map(i => points[i]));

    const lines = [
      ear.line.fromPoints,
      ear.ray.fromPoints,
      ear.ray.fromPoints,
      ear.segment,
      ear.segment,
    ].map((f, i) => f(segments[i]));

    const clips = ["clipLine", "clipRay", "clipRay", "clipSegment", "clipSegment"]
      .map((key, i) => boundary[key](lines[i]));

    const svgLines = clips
      .map((seg, i) => top.line(seg[0], seg[1])
        .stroke(colors[i])
        .strokeWidth(radius/2));

    const sides = lines
      .map(line => line.vector.rotate90().normalize().scale(EPSILON));

    const leftcap = [-1, -1, 1, -1, 1]
      .map((s, i) => lines[i].vector.normalize().scale(s * EPSILON));
    const rightcap = [-1, -1, 1, 1, -1]
      .map((s, i) => lines[i].vector.normalize().scale(s * EPSILON));

    sides.map((side, i) => bottom.polygon(
      side.add(leftcap[i]).add(clips[i][0]),
      side.add(rightcap[i]).add(clips[i][1]),
      side.flip().add(rightcap[i]).add(clips[i][1]),
      side.flip().add(leftcap[i]).add(clips[i][0]),
    ));

    const args = [
      [lines[0].vector, lines[0].origin],
      [lines[1].vector, lines[1].origin],
      [lines[2].vector, lines[2].origin],
      [lines[3][0], lines[3][1]],
      [lines[4][0], lines[4][1]],
    ];
    const point_on = funcs
      .map((f, i) => f(points[10], ...args[i], EPSILON));
    const any = point_on.reduce((a, b) => a || b, false);
    points[10].svg.fill(any ? "#e53" : "black");
  }, true);
