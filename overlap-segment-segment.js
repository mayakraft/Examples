const EPSILON = 0.5;

svg.size(4, 4);
const radius = 0.2;
const bottom = svg.g().stroke("none").fill("#edb");
const mid = svg.g();
const top = svg.g();

const pointPositions = Array.from(Array(2))
  .map((_, i) => [[i*2 + 1, 1], [i*2 + 1, 3]])
  .reduce((a, b) => a.concat(b), []);

const boundary = ear.polygon([100, 100], [-100, 100], [-100, -100], [100, -100]);

svg.controls(4)
  .position((_, i) => pointPositions[i])
  .svg((_, i) => svg.circle().radius(radius*2/3).fill("#e53"))
  .onChange((point, i, points) => {
    bottom.removeChildren();
    top.removeChildren();

    const segments = Array.from(Array(2))
      .map((_, i) => [i * 2, i * 2 + 1])
      .map(indices => indices.map(i => points[i]))
      .map(points => ear.segment(...points));

    const overlap = ear.math.overlap_line_line(
      segments[0].vector, segments[0].origin,
      segments[1].vector, segments[1].origin,
      ear.math.include_s, ear.math.exclude_s,
			EPSILON);

		const color = overlap ? "#fb4" : "black";

    points.forEach(p => p.svg.fill(color));

		// adjust the points of the exclusive line inward
		const linePoints = segments;
		const line1Vec = segments[1].vector.normalize().scale(EPSILON);
		linePoints[1] = ear.segment(
			ear.math.add(linePoints[1][0], line1Vec),
			ear.math.add(linePoints[1][1], ear.math.flip(line1Vec))
		);
		
    const svgLines = linePoints
			.map((seg, i) => top.line(seg[0], seg[1])
      .stroke(color)
      .strokeWidth(radius/2));

		if (ear.math.distance(points[2], points[3]) < EPSILON * 2) {
			svgLines[1].remove();
			svgLines.pop();
		}

    points.forEach(p => bottom.circle(p)
      .radius(EPSILON)
      .fill("#edb")
      .stroke("none"));

    [0].map(i => segments[i]).forEach(seg => [seg[0], seg[1]]
      .forEach((s, i) => top
        .line(s, s.add(seg.vector.normalize().scale(i === 0 ? -1 : 1).scale(EPSILON)))
          .stroke(color)
          .strokeDasharray(`${radius/100} ${radius/1.5}`)
          .strokeLinecap("round")
          .strokeWidth(radius/2)));
  }, true);

