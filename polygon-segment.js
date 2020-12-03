svg.size(-1.25, -1.25, 2.5, 2.5);

const strokeWidth = svg.getWidth()*0.02;
const radius = strokeWidth * 2;
const polygon = ear.polygon([1,0], [0,1], [-1,0], [0,-1]);

polygon.svg()
  .appendTo(svg)
  .fill("white")
  .stroke("black")
  .strokeWidth(strokeWidth);
polygon.points.map(p => svg.circle(p)
  .radius(radius)
  .fill("white")
  .stroke("black")
  .strokeWidth(strokeWidth));
const line = svg.line()
  .stroke("#fb4")
  .strokeWidth(strokeWidth)
  .strokeDasharray("5 10")
  .strokeLinecap("round");

const layer = svg.g();
const touchLayer = svg.g();

svg.controls(2)
  .svg(() => touchLayer.circle().radius(radius).fill("#e53"))
  .position(() => [svg.getWidth(), svg.getHeight()]
    .map(l => l * (Math.random() - 0.5)))
  .onChange((p, i, points) => {
    line.setPoints(points);
    layer.removeChildren();
    const intersections = polygon.intersect(ear.segment(points));
    if (intersections === undefined) { return; }
    intersections.map(pt => layer.circle(pt).radius(radius).fill("#158"));
  }, true);
