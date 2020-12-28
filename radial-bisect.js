svg.size(-1, -1, 2, 2)
  .padding(0.15)
  .strokeWidth(svg.getWidth() / 30)
  .strokeLinecap("round");

const wedge = svg.wedge().fill("#158");
const lines = ["#fb4", "black"]
  .map(color => svg.line().stroke(color));
const circle = svg.circle(0.12).fill("#e53");

const onChange = function (point, i, points) {
  const vectors = points.map(p => ear.vector(p));
  const angles = points.map(p => Math.atan2(p[1], p[0]));
  const bisectA_B = ear.math.counter_clockwise_bisect2(vectors[0], vectors[1]);
  circle.setPosition(bisectA_B);
  wedge.setArc(0, 0, 0.75, angles[0], angles[1]);

  lines.forEach((line, i) => line
    .setPoints(vectors[i].scale(0.8)));
};

svg.controls(2)
  .position(() => {
    const angle = Math.random() * Math.PI * 2;
    return [Math.cos, Math.sin].map(f => f(angle));
  })
  .onChange(onChange, true)
  .forEach((p) => {
    p.updatePosition = (mouse) => [Math.cos, Math.sin]
      .map(f => f(Math.atan2(mouse.y, mouse.x)));
  });

