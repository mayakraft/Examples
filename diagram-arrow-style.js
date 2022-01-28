var COUNT = 4;
var space = 0.1;

svg.size((1 + space) * COUNT - space, 1)
  .padding(0.1)
  .stroke("black")
  .strokeWidth(0.03);

var layer = svg.g()
  .strokeWidth(0.01)
  .fill("white");
  
var arrows = [];

for (var i = 0; i < COUNT; i++) {
  var x = (1 + space) * i;
  layer.rect(x, 0, 1, 1);
  // four simple arrows with one arrowhead
  var arrow = svg.arrow(x, 0, x+1, 1)
    .head({ width: 0.1, height: 0.15 });
  arrows.push(arrow);
}

// style each arrow
// the first is left unchanged

arrows[1]
  .bend(0.2);

arrows[2]
  .bend(0.2)
  .padding(0.08);

arrows[3]
  .bend(0.2)
  .padding(0.1)
  .tail({ width: 0.1, height: 0.15 })
  .getTail()
  .stroke("black")
  .fill("white")
  .strokeWidth(0.02);
