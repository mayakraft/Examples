svg.size(-1, -1, 2, 2)
  .padding(0.25)
  .strokeWidth( svg.getWidth() / 40 )
  .strokeLinecap("round");

const wedge = svg.wedge().fill("#158");
const lines = ["#e53", "black"]
  .map(color => svg.line().stroke(color));
const circle = svg.circle(0.1);

const onChange = function (point, i, points) {
  const vectors = points.map(p => ear.vector(p));
  const angles = points.map(p => Math.atan2(p[1], p[0]));
  wedge.setArc(0, 0, 0.5, angles[0], angles[1]);
  lines.forEach((line, i) => line.setPoints(points[i]));
  const isBetween = ear.math.is_counter_clockwise_between(angles[2], angles[0], angles[1]);
  circle.setPosition(vectors[2].scale(1.15))
    .fill(isBetween ? "#fb4" : "black");
};

svg.controls(3)
  .position(() => {
    const angle = Math.random() * Math.PI * 2;
    return [Math.cos, Math.sin].map(f => f(angle));
  })
  .onChange(onChange, true)
  .forEach((p) => {
    p.updatePosition = (mouse) => [Math.cos, Math.sin]
      .map(f => f(Math.atan2(mouse.y, mouse.x)));
  });

