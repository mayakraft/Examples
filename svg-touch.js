const GRIDS = 8;

svg.size(-1.5, -1.5, 3, 3).strokeWidth(0.04);
const gridLayer = svg.g().stroke("lightgray")
const p = svg.polyline()
  .fill("none")
  .stroke("#e53")
	.strokeLinejoin("round")
	.strokeWidth(0.1);
const drawLayer = svg.g();

// grid lines
for (let i = -GRIDS; i <= GRIDS; i += 1) {
  gridLayer.line(i, -GRIDS, i, GRIDS);
  gridLayer.line(-GRIDS, i, GRIDS, i);
}
gridLayer.line(0, -GRIDS, 0, GRIDS).stroke("black");
gridLayer.line(-GRIDS, 0, GRIDS, 0).stroke("black");

const points = [];

const update = (mouse) => {
  drawLayer.removeChildren();
	if (mouse.buttons) {
		drawLayer.circle(mouse.press, 0.2).fill("black");
	}
  if (typeof callback === "function") { callback(mouse); }
};

svg.onMove = (mouse) => {
  points.push(mouse);
  if (points.length > 30) { points.shift(); }
  p.setPoints(points);
  update(mouse);
};

svg.onPress = mouse => update(mouse);
svg.onRelease = mouse => update(mouse);

