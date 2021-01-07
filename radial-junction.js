svg.size(-1, -1, 2, 2)
  .padding(0.05)
  .strokeWidth(svg.getWidth() / 40)
  .strokeLinecap("round");

const NUM = 6;
const layer = svg.g();
const colors = ["#158", "#fb4"];
const lines = Array.from(Array(NUM))
  .map(() => svg.line().stroke("black"));
lines[0].stroke("#e53");

const onChange = function (point, i, points) {
  layer.removeChildren();
  const vectors = points.map(p => ear.vector(p)); 
  const angles = points.map(p => Math.atan2(p[1], p[0]));
  lines.forEach((line, i) => line
    .setPoints(points[i]));
  ear.math.counter_clockwise_order2(vectors)
    .map((index, i, arr) => [index, arr[(i + 1) % arr.length]])
    .map((pair, i) => layer
    .wedge(0, 0, 0.8, angles[pair[0]], angles[pair[1]])
    .fill(colors[i % 2]));
  points.forEach(vec => layer.line(vec.x, vec.y)
    .stroke("white")
    .strokeWidth(svg.getWidth() / 17));
};

svg.controls(NUM)
  .position((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    return [Math.cos, Math.sin].map(f => f(angle));
  })
  .onChange(onChange, true)
  .forEach((p, i) => {
    p.updatePosition = (mouse) => [Math.cos, Math.sin]
      .map(f => f(Math.atan2(mouse.y, mouse.x)));
  });

