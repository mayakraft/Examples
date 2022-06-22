svg.size(-200, -200, 400, 400);

const NUM = 10;
const lines = Array
  .from(Array(NUM))
  .map(() => svg.line()
    .strokeWidth(8)
    .strokeLinecap("round"));

const touchLayer = svg.g();
const topLayer = svg.g();

const vmin = (svg.getWidth() > svg.getHeight()
  ? svg.getHeight()
  : svg.getWidth());

const onChange = function (point, i, points) {
  const vectors = ear.math
    .counterClockwiseOrder2(points)
    .map(i => points[i]);

  topLayer.removeChildren();
  touchLayer.removeChildren();

  vectors
    .slice()
    .reverse()
    .map(p => ear.math.normalize(p))
    .map(p => ear.math.scale(p, vmin * 0.3))
    .forEach((p, revI) => {
      const i = NUM - revI - 1;
      lines[i]
        .setPoints(0, 0, p[0], p[1])
        .stroke(i === 0 ? "#e53" : "black");
    });
  vectors
    .map(p => ear.math.normalize(p))
    .map(p => ear.math.scale(p, vmin * 0.4))
    .reverse()
    .map((p, revI) => {
      const i = NUM - revI - 1;
      topLayer.circle(p[0], p[1], 24)
        .fill(i === 0 ? "#e53" : "black");
      topLayer.text(`${i}`, p[0], p[1])
        .fontSize(40)
        .fontWeight(800)
        .fontFamily("Avenir Next, Helvetica, Arial, Noto Sans")
        .dominantBaseline("middle")
        .textAnchor("middle")
        .fill("white")
        .setAttribute("transform", "translate(0 3)");
    });
};

svg.controls(NUM)
  .position(() => {
    const angle = Math.random() * Math.PI * 2;
    return [Math.cos, Math.sin]
      .map(f => f(angle))
      .map(n => n * vmin * 0.4);
  })
  .onChange(onChange, true)
  .forEach((p) => {
    p.updatePosition = (mouse) => [Math.cos, Math.sin]
      .map(f => f(Math.atan2(mouse.y, mouse.x)))
      .map(n => n * vmin * 0.4);
  });
