const EPSILON = 0.5;
const radius = EPSILON / 2;

svg.size(10, 6);
const bottom = svg.g().stroke("none").fill("#edb");
const top = svg.g();

// make endpoints for each line, match consistent color
const colors = ["#fb4", "#158", "#158", "#e53", "#e53", "black"];
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
};

const boundary = ear.polygon([-1, -1], [1, -1], [1, 1], [-1, 1]).scale(100);

// demonstrate both inclusive and exclusive for all line types
const domains = [
  "inclusive", "inclusive", "exclusive", "inclusive", "exclusive"
];

svg.controls(11)
  .position((_, i) => pointPositions[i])
  .svg((_, i) => stylePoints(svg.circle().radius(radius), i))
  .onChange((point, i, points) => {
    bottom.removeChildren();
    top.removeChildren();

    // gather control points into pairs
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

    // set each line.exclusive() or line.inclusive()
    domains.forEach((domain, i) => lines[i][domain]());

    const clips = lines.map(line => boundary.clip(line));

    const svgLines = clips
      .map((seg, i) => top.line(seg[0], seg[1])
        .stroke(colors[i])
        .strokeWidth(radius/2));

    // fill rectangles that enclose the epsilon space around each line
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

    const point_on = lines.map(line => line.overlap(points[10], EPSILON));
    const any = point_on.reduce((a, b) => a || b, false);
    points[10].svg.fill(any ? "#e53" : "black");

  }, true);

