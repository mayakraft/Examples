svg.size(100, 100);

var arrowBlue = svg.arrow()
  .stroke("#158")
  .fill("#158")
  .strokeWidth(8)
  .head({ width: 8, height: 9 });

var arrowBlack = svg.arrow()
  .stroke("black")
  .strokeWidth(0.3)
  .head({ width: 3, height: 4 })
  .tail({ width: 3, height: 4 });

var arrowRed = svg.arrow()
  .stroke("#e53")
  .fill("#e53")
  .bend(0.4)
  .head({ width: 4, height: 6 });

svg.controls(4)
  .position(function () { return [Math.random() * svg.getWidth(), Math.random() * svg.getHeight()]; })
  .onChange(function (p, i, pts) {
    arrowBlue.setPoints(pts[0], pts[1]);
    arrowBlack.setPoints(pts[1], pts[2]);
    arrowRed.setPoints(pts[2], pts[3]);
  }, true);
