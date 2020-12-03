var callback;

const reflLayer = svg.g();

const line = svg.line()
  .stroke("#e53")
  .strokeWidth(3)
  .strokeDasharray("6 6")
  .strokeLinecap("round");

const dots = Array.from(Array(20)).map(() => {
  const x = Math.random() * svg.getWidth();
  const y = Math.random() * svg.getHeight();
  const circle = svg.circle(x, y, 6).fill("#158");
  return { pos: [x, y], svg: circle };
});

const update = (p, i, points) => {
  reflLayer.removeChildren();
  const vec = [points[1].x - points[0].x, points[1].y - points[0].y];
  const matrix = ear.matrix().reflectZ(vec, points[0]);
  line.setPoints(points[0].x, points[0].y, points[1].x, points[1].y);
  dots.map(p => matrix.transformVector(p.pos))
    .forEach(p => reflLayer.circle(p.x, p.y, 6).fill("#fb3"));
  if (callback !== undefined) {
    callback({ matrix, segment: points });
  }
};

svg.controls(2)
  .svg(() => ear.svg.circle().radius(8).fill("#e53"))
  .position((_, i) => [(i % 2 === 0 ? 0.75 : 0.25) * svg.getWidth(), 0.5 * svg.getHeight()])
  .onChange(update, true);
