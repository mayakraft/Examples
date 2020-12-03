const EPSILON = 0.5;

svg.size(8, 4);
const radius = 0.2;
const bottom = svg.g().stroke("none").fill("#edb");
const mid = svg.g();
const top = svg.g();

const pointPositions = Array.from(Array(4))
  .map((_, i) => [[i*2 + 1, 1], [i*2 + 1, 3]])
  .reduce((a, b) => a.concat(b), []);

const boundary = ear.polygon([100, 100], [-100, 100], [-100, -100], [100, -100]);

svg.controls(8)
  .position((_, i) => pointPositions[i])
  .svg((_, i) => svg.circle().radius(radius*2/3).fill("#e53"))
  .onChange((point, i, points) => {
    bottom.removeChildren();
    top.removeChildren();

    const segments = Array.from(Array(4))
      .map((_, i) => [i * 2, i * 2 + 1])
      .map(indices => indices.map(i => points[i]))
      .map(points => ear.segment(...points));

    const svgLines = segments.map((seg, i) => top.line(seg[0], seg[1])
      .stroke("#e53")
      .strokeWidth(radius/2));

    [0, 1, 2, 3].map(i => points[i]).forEach(p => bottom.circle(p)
      .radius(EPSILON)
      .fill("#edb")
      .stroke("none"));

    [4, 5, 6, 7].map(i => points[i]).forEach(p => top.circle(p)
      .radius(EPSILON)
      .fill("#edb")
      .stroke("none"));

    [0, 1].map(i => segments[i]).forEach(seg => [seg[0], seg[1]]
      .forEach((s, i) => top
        .line(s, s.add(seg.vector.normalize().scale(i === 0 ? -1 : 1).scale(EPSILON)))
          .stroke("#e53")
          .strokeDasharray(`${radius/100} ${radius/1.5}`)
          .strokeLinecap("round")
          .strokeWidth(radius/2)));

    // [2, 3].map(i => segments[i]).forEach(seg => [seg[0], seg[1]]
    //   .forEach((s, i) => top
    //     .line(s, s.add(seg.vector.normalize().scale(i === 0 ? 1 : -1).scale(EPSILON)))
    //       .stroke("#edb")
    //       .strokeDasharray(`${radius/100} ${radius/1.5}`)
    //       .strokeLinecap("round")
    //       .strokeWidth(radius/2)));

    const type = [
      ear.math.include_s, ear.math.include_s,
      ear.math.exclude_s, ear.math.exclude_s
    ];

    points.forEach(p => p.svg.fill("#e53"));

    [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]].forEach(pair => {
      const intersect = ear.math.intersect_lines(
        segments[pair[0]].vector, segments[pair[0]].origin,
        segments[pair[1]].vector, segments[pair[1]].origin,
        type[pair[0]], type[pair[1]], EPSILON);
      if (intersect) {
        pair.map(i => svgLines[i]).forEach(line => line.stroke("#fb4"));
        pair.map(i => [i*2, i*2+1]).reduce((a, b) => a.concat(b), [])
          .map(i => points[i]).forEach(p => p.svg.fill("#fb4"));
        // intersect point
        top.circle(intersect).radius(radius).fill("#e53");
      }
    });
  }, true);
