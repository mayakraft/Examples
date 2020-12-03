var callback;

svg.size(-1.5, -1.5, 3, 3);

let arrowhead = svg.marker()
  .setViewBox(0, -1, 2, 2);
  // .orient("auto-start-reverse");
arrowhead.setAttribute("orient", "auto");

arrowhead.polygon(0, 1, 2, 0, 0, -1).fill("black");

const strokeWidth = 0.05;
const dashArray = `${strokeWidth} ${strokeWidth * 2}`;
const dotArray = `${strokeWidth / 100} ${strokeWidth * 2}`;

svg.strokeWidth(strokeWidth);
const gridLayer = svg.g().stroke("#eee");
const drawLayer = svg.g()
  .strokeLinecap("round")
  .fontFamily("Avenir Next, Helvetica, Arial, Noto Sans")
  .fontWeight("700")
  .fontSize("0.28px");
drawLayer.setAttribute("text-anchor", "middle");
drawLayer.setAttribute("user-select", "none");
const dotLayer = svg.g();



for (let i = -12; i <= 12; i += 1) {
  const s = i;
  gridLayer.line(s, -svg.getHeight() * 4, s, svg.getHeight() * 4);
  gridLayer.line(-svg.getWidth() * 4, s, svg.getWidth() * 4, s);
}

const onChange = function (point, i, points) {
  drawLayer.removeChildren();
  const vecs = points.map(ear.vector);
  const add = vecs[0].add(vecs[1]);
  const sub = vecs[0].subtract(vecs[1]);
  const vecLines = vecs.map(v => drawLayer.line(0, 0, v.x, v.y).stroke("#158"));
  vecLines[1].strokeDasharray(dashArray);
  drawLayer.line(0, 0, add.x, add.y).stroke("#fb4")
    .strokeDasharray(dotArray)
    .markerEnd(arrowhead);
  drawLayer.line(vecs[0].x, vecs[0].y, add.x, add.y)
    .stroke("#158")
    .strokeDasharray(dashArray);
  drawLayer.line(vecs[0].x, vecs[0].y, sub.x, sub.y)
    .stroke("#e53")
    .strokeDasharray(dashArray)
    .markerEnd(arrowhead);

  if (callback != null) {
    callback({ vector: points[0], normalized });
  }
};

svg.controls(2)
  .svg(() => dotLayer.circle().radius(0.12).fill("#e53"))
  .position(() => [Math.cos, Math.sin]
    .map(f => f(Math.random() * Math.PI * 2)))
  .onChange(onChange, true);
