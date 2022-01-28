svg.size(-1.5, -1.5, 3, 3);

const strokeWidth = 0.04;
const GRIDS = 8;
svg.strokeWidth(strokeWidth);

const gridLayer = svg.g()
  .fill("lightgray")
  .strokeLinecap("round")
  .stroke("lightgray")
  .strokeWidth(strokeWidth);

const arrowhead = svg.marker()
	.orient("auto-start-reverse")
	.refY(0.5)
	.markerWidth(4)
	.markerHeight(4)
	.setViewBox(0, 0, 1, 1);
const arrowPolygon = arrowhead.polygon(0, 0, 0, 1, Math.sqrt(3)/2, 0.5)
	.fill("#fb4")
	.stroke("none");

// grid lines
for (let i = -GRIDS; i <= GRIDS; i += 1) {
  gridLayer.line(i, -GRIDS, i, GRIDS);
  gridLayer.line(-GRIDS, i, GRIDS, i);
}
gridLayer.line(0, -GRIDS, 0, GRIDS).stroke("black");
gridLayer.line(-GRIDS, 0, GRIDS, 0).stroke("black");

let segment = svg.line().stroke("#fb4")
let dLine = svg.line()
  .stroke("#000")
  .strokeLinecap("round")
  .strokeDasharray("0.0001 0.075")
const drawLayer = svg.g();

svg.controls(1)
  .position(() => [Math.random(), Math.random()])
  .onChange(p => {
    let point = ear.vector(p);
    let isBelow = point.dot([0, 1]) < 0;
    let u = isBelow
      ? point.normalize()
      : point.normalize().scale(-1);
    let vector = point.rotate90().normalize();
    let line = ear.line(vector, point);
    let segA = point.add(vector.scale(50));
    let segB = point.subtract(vector.scale(50));
    segment.setPoints(segA, segB);
    drawLayer.removeChildren();
    let mid = point.scale(0.5);
    dLine.setPoints([0, 0], point);
    let d = point.magnitude() * (isBelow ? 1 : -1);
    drawLayer.text("d=" + d.toFixed(2), mid.x, mid.y)
      .fill("#e53")
      .fontWeight("700")
      .fontSize(0.5)
      .fontFamily("Avenir Next, Helvetica, Arial, Noto Sans");
    let arrowStart = point.add(vector.scale(isBelow ? -0.25 : 0.25));
    let arrowEnd = point.add(vector.scale(isBelow ? -0.25 : 0.25)).add(u).add(point.normalize().scale(isBelow ? -0.25 : 0.25));
    drawLayer.line(arrowStart, arrowEnd)
      .stroke("#fb4")
      .strokeWidth(strokeWidth * 2)
      .markerEnd(arrowhead);
    let arrowMid = arrowStart.midpoint(arrowEnd).add(vector.scale(isBelow ? 0.3 : -0.3));
    drawLayer.text("u", arrowMid.x, arrowMid.y)
      .fill("#e53")
      .fontWeight("700")
      .fontSize(0.5)
      .fontFamily("Avenir Next, Helvetica, Arial, Noto Sans");
  }, true);
