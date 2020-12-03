svg.size(1200, 800);

var back = svg.g();
var l1 = svg.line().stroke("black");
var l2 = svg.line().stroke("black");
var curve = svg.path();

svg.controls(4)
  .svg(function () { return ear.svg.circle(0, 0, svg.getWidth() * 0.05).fill("#e53"); })
  .position(function () { return [svg.getWidth(), svg.getHeight()]
    .map(function(n) { return n * Math.random(); }); })
  .parent(back)
  .onChange(function (point, i, points) {
    l1.setPoints(points[0], points[1]);
    l2.setPoints(points[3], points[2]);
    curve.clear().Move(points[0]).Curve(points[1], points[2], points[3]);
  }, true);
