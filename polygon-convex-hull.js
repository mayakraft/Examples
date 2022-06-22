svg.size(1, 1)
	.strokeWidth(svg.getWidth() / 50);

const layer = svg.g();
const svgPolygon = svg.polygon()
  .fill("none")
  .stroke("#fb4")

const onChange = (p, i, points) => {
  layer.removeChildren();
  const polygon = ear.polygon.convexHull(points);
  svgPolygon.setPoints(polygon);
	const corners = polygon.vectors
		.map((v, i, arr) => [v, ear.math.flip(arr[(i - 1 + arr.length) % arr.length])]);

	corners.map(pair => ear.math.clockwiseBisect2(...pair))
		.map(vec => ear.math.scale(vec, 0.2))
		.map((vec, i) => [polygon[i], ear.math.add(polygon[i], vec)])
		.map(seg => layer.line(seg[0], seg[1]).stroke("#fb4"));

	corners
		.map(pair => pair.map(v => Math.atan2(v[1], v[0])))
		.forEach((pair, i) => layer
			.wedge(polygon[i][0], polygon[i][1], 0.15, pair[0], pair[1])
				.stroke("none")
				.fill("#158"));
};

svg.controls(6)
  .svg(() => svg.circle(svg.getWidth() / 30).fill("#e53"))
  .position(() => [Math.random() * svg.getWidth(), Math.random() * svg.getHeight()])
  .onChange(onChange, true);

