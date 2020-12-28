svg.size(-1, -1, 2, 2);
// svg.background('transparent');

svg.stroke("black")
  .strokeWidth(0.025);

svg.circle(1).fill("white").stroke("none");

const layer = svg.g();

svg.circle(0.3).fill("white").stroke("none");

const onChange = (p, i, points) => {
  layer.removeChildren();
  points.forEach(p => layer.line(p))
};

svg.controls(7)
  .svg(() => svg.circle(0.05).stroke("none").fill("#e53"))
  .position(() => {
    const angle = Math.random() * Math.PI * 2;
    return [Math.cos, Math.sin]
      .map(f => f(angle))
      .map(n => n * 0.9);
  })
  .onChange(onChange, true)
  .forEach((p) => {
    p.updatePosition = (mouse) => [Math.cos, Math.sin]
      .map(f => f(Math.atan2(mouse.y, mouse.x)))
      .map(n => n * 0.9);
  });
