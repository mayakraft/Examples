var windowAspect = window.innerWidth / window.innerHeight;
var VecTw = window.innerWidth > window.innerHeight ? windowAspect * 2.8 : 2.0;
var VecTh = window.innerWidth > window.innerHeight ? 2.8 : 2.0 / (windowAspect);

svg.size(-VecTw / 2, -VecTh / 2, VecTw, VecTh);

const strokeWidth = 0.04;
const GRIDS = 8;

const gridLayer = svg.g()
  .fill("lightgray")
  .stroke("lightgray")
  .strokeLinecap("round")
  .strokeWidth(strokeWidth);
const drawLayer = svg.g()
  .fill("none")
  .strokeWidth(strokeWidth);

// grid lines
for (let i = -GRIDS; i <= GRIDS; i += 1) {
  gridLayer.line(i, -GRIDS, i, GRIDS);
  gridLayer.line(-GRIDS, i, GRIDS, i);
}
gridLayer.line(0, -GRIDS, 0, GRIDS).stroke("black");
gridLayer.line(-GRIDS, 0, GRIDS, 0).stroke("black");

// shapes
drawLayer.line(-4, -4, 4, 4).stroke("darkgray");
const pow2 = drawLayer.path().stroke("#fb3");
const pow3 = drawLayer.path().stroke("#e53");
const sqrt2 = drawLayer.path().stroke("#158");

pow2.Move(-4, Math.pow(-4, 2));
pow3.Move(-4, Math.pow(-4, 3));
for (let i = -4; i < 4; i += 0.01) {
  pow2.Line(i, Math.pow(i, 2));
  pow3.Line(i, Math.pow(i, 3));
}

sqrt2.Move(0, Math.pow(0, 0.5));
for (let i = 0; i < 4; i += 0.01) {
  sqrt2.Line(i, Math.pow(i, 0.5));
}

svg.onMove = function (mouse) {
  if (typeof callback === "function") {
    callback(mouse);
  }
};
