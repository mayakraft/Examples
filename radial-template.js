svg.size(-1, -1, 2, 2)
  .padding(0.1)
  .strokeWidth( svg.getWidth() / 100 )
  .stroke('black')
	.strokeLinecap("round");

const NUM = 2;
const lines = Array.from(Array(NUM)).map(() => svg.line()
  .stroke("#bbb"));

const layer = svg.g();

const onChange = function (point, i, points) {
  layer.removeChildren();

  const vectors = points
		.map(p => ear.vector(p).normalize());
		
	lines.forEach((line, i) => line.setPoints(points[i]));
};

svg.controls(NUM)
  .position(() => {
    const angle = Math.random() * Math.PI * 2;
    return [Math.cos, Math.sin].map(f => f(angle));
  })
  .onChange(onChange, true)
  .forEach((p) => {
    p.updatePosition = (mouse) => [Math.cos, Math.sin]
      .map(f => f(Math.atan2(mouse.y, mouse.x)));
  });

