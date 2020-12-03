svg.size(0, 0, 600, 420);
svg.background("white", true);

const random = (min, max) => (Math.random() * (max - min)) + min;

function dragon(x1, y1, x2, y2, turn, i) {
  if (i < 0) { return [[x1, y1], [x2, y2]]; }
  var midX = x1 + (x2 - x1) * 0.5 + turn * (y2 - y1) * 0.5;
  var midY = y1 + (y2 - y1) * 0.5 + (-1 * turn) * (x2 - x1) * 0.5;
  var first = dragon(x1, y1, midX, midY, 1, i - 1);
  if (first.length > 1) { first.pop(); }
  return first.concat(dragon(midX, midY, x2, y2, -1, i - 1));
}

var attrs = { strokeLinecap: "square", fill: "none" };

var x1 = svg.getWidth() * 0.27;
var y1 = svg.getHeight() * 0.75;
var x2 = svg.getWidth() * 0.85;
var y2 = svg.getHeight() * 0.5;

svg.polyline(dragon(x1, y1, x2, y2, 1, random(4, 6)))
  .setAttributes(attrs).stroke("#fb4").strokeWidth(27);

svg.polyline(dragon(x1, y1, x2, y2, 1, random(9, 11)))
  .setAttributes(attrs).stroke("#158").strokeWidth(4);
