svg.size(2, 1)
	.padding(0.2)
	.strokeWidth(svg.getHeight() / 50);

const radii = [1/2, 2/3];
const circles = radii.map(r => svg.circle(r)
	.fill("none")
	.stroke("black"));

const layer = svg.g();

svg.controls(2)
  .svg(() => svg.circle().radius(svg.getHeight() / 20).fill("#e53"))
  .position((_, i) => [i === 0 ? 0.5 : 1.5, 0.5])
  .onChange((point, i, points) => {
		layer.removeChildren();
		circles.forEach((c, i) => c.setCenter(points[i]));
		
		const intersect = ear.circle(points[0], radii[0])
			.intersect(ear.circle(points[1], radii[1]));
		if (!intersect) { return; }

		intersect.forEach(pt => layer.circle(pt)
			.radius(svg.getHeight() / 20)
			.fill("#158"));
  }, true);

