svg.size(400, 100);
svg.background("#fed", true);

var points = [];

var p = svg.polygon()
  .fillRule("evenodd")
  .fill("#e53")
  .stroke("#158");

svg.onMove = function (mouse) {
  points.push(mouse);
  if (points.length > 100) { points.shift(); }
  p.setPoints(points);
};
