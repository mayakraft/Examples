svg.size(-1, -1, 2, 2);
// svg.background("black");

var lines = svg.g().strokeWidth(0.01);
var dots = svg.g().fill("#ec3");
var i = [0, 1];
var stroke = "#158";

svg.play = function (e) {
  if (Math.random() * 25 < 1) {
    i[0] = parseInt(Math.random() * 4);
    i[1] = parseInt(Math.random() * 4);
    stroke = random(["#158", "#e53"]);
  }
  dots.circle(noise(e.time + 0), noise(e.time + 100), 0.02);
  dots.circle(noise(e.time + 10), noise(e.time + 90), 0.02);
  dots.circle(noise(e.time + 20), noise(e.time + 80), 0.02);
  dots.circle(noise(e.time + 30), noise(e.time + 70), 0.02);
  lines.line(
    noise(e.time + 10 * i[0]),
    noise(e.time + 100 - 10 * i[0]),
    noise(e.time + 10 * i[1]),
    noise(e.time + 100 - 10 * i[1])
  ).stroke(stroke);

  while (dots.childNodes.length > 60) { dots.firstChild.remove(); }
  while (lines.childNodes.length > 100) { lines.firstChild.remove(); }
};
