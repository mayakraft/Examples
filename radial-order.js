var callback;

svg.size(-1, -1, 2, 2)
  .padding(0.05)
  .strokeWidth(svg.getWidth() / 40)
  .strokeLinecap("round");

const arrowhead = svg.marker()
  .orient("auto-start-reverse")
  .refY(0.5)
  .markerWidth(3)
  .markerHeight(3);
arrowhead.setAttribute("viewBox", "0 0 1 1");
arrowhead.polygon(0, 0, 0, 1, 0.866, 0.5)
  .fill("#000")
  .stroke("none");

const NUM = 5;
const gridLayer = svg.g().fill("none").stroke("#ddd");
gridLayer.circle(0.333);
gridLayer.circle(0.666);
gridLayer.circle(1.0);
for (let i = 0; i < 6; i += 1) {
  const a = Math.PI * i / 3;
  gridLayer.line(Math.cos(a), Math.sin(a));
}
const arrowLine = svg.line()
	.stroke("#ddd")
	.strokeDasharray("0.0001 0.1");
const arrowArc = svg.arc()
  .stroke("#000")
  .fill("none")
	// .strokeDasharray("0.0001 0.1")
  .markerEnd(arrowhead);
const lines = Array.from(Array(NUM))
  .map(() => svg.line().stroke("#158"));

const onChange = function (point, i, points) {
  const vectors = points.map(p => ear.vector(p)); 
  const angles = points.map(p => Math.atan2(p[1], p[0]));
	arrowLine.setPoints(0, 0, vectors[0].x, vectors[0].y);
	arrowArc.setArc(0, 0, 1, angles[0], angles[0] + 0.4);
  lines.forEach((line, i) => line
    .setPoints(vectors[i].scale((i/(NUM-1)*0.75 + 0.25))));
  const order = ear.math.counter_clockwise_vector_order(...vectors);
  // const order = ear.math.counter_clockwise_radians_order(...angles);
  if (callback) {
    callback({ order });
  }
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

