svg.size(-200, -200, 400, 400);

const NUM = 10;
const lines = Array.from(Array(NUM)).map(() => svg.line()
  .stroke("#bbb")
  .strokeWidth(8)
  .strokeLinecap("round"));

const touchLayer = svg.g();
const topLayer = svg.g();
topLayer.setAttribute("pointer-events", "none");

const vmin = (svg.getWidth() > svg.getHeight()
  ? svg.getHeight()
  : svg.getWidth());

const onChange = function (point, i, points) {
  const vectors = ear.math
    .counter_clockwise_vector_order(...points)
    .map(i => points[i]);

  topLayer.removeChildren();
  touchLayer.removeChildren();

  vectors.slice().reverse().forEach((p, revI) => {
    const i = NUM - revI - 1;
    lines[i]
      .setPoints(0, 0, p[0], p[1])
      .stroke(i === 0 ? "#e53" : `#bbb`);
    });
  vectors
    .map(p => ear.math.normalize(p))
    .map(p => ear.math.scale(p, vmin * 0.4))
    .reverse()
    .map((p, revI) => {
      const i = NUM - revI - 1;
      topLayer.circle(p[0], p[1], 30)
        .fill("black")
        .stroke(i === 0 ? "#e53" : `#bbb`)
        .strokeWidth(8);
      topLayer.text(i === 0 ? "*" : `${i}`, p[0], p[1])
        .fontSize(30)
        .fontWeight(800)
        .fontFamily("Noto Sans")
        .dominantBaseline("middle")
        .textAnchor("middle")
        .fill(i === 0 ? "#e53" : `#bbb`);
    });
    // .forEach(text => {
    //   text.setAttribute("user-select", "none");
    // });
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
