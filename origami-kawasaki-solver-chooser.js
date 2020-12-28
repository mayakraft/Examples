svg.size(-1.1, -1.1, 4.7, 2.2);
svg.strokeWidth(0.033);
svg.strokeLinecap("round");

svg.circle(1).fill("white").stroke("black");
svg.circle(2.5, 0, 1).fill("white").stroke("black");

var slider; // HTML slider input
var countLabel; // HTML <p> element
var layer = svg.g();
var controls;

var solutions = [];
var sliderCount = 5

const updateLabel = () => {
  if (countLabel) {
    countLabel.innerHTML = `${sliderCount} inputs, ${solutions.length} solution${solutions.length > 1 ? "s" : ""}`;
  }
};

const onChange = (p, i, points) => {
  layer.removeChildren();

  points.map(p => ear.ray(p))
    .map(ray => ray.normalize())
    .forEach(r => layer.line(r.origin, r.origin.add(r.vector))
      .stroke("black"));

  var radians = points
    .map(v => Math.atan2(v[1], v[0]))
    .sort((a, b) => a - b);

  solutions = ear.math.kawasaki_solutions_radians(radians)
    .filter(s => s !== undefined);
  solutions.forEach(angle => layer
    .line(0, 0, Math.cos(angle), Math.sin(angle))
    .strokeDasharray("0.0333 0.0666")
    .stroke("#e53"));

  if (solutions.length === points.length) {
    points.map(p => ear.ray(p, [2.5, 0]))
      .map(ray => ray.normalize())
      .forEach(r => layer.line(r.origin, r.origin.add(r.vector))
        .stroke("#e53"));
    const creases = solutions.slice(0, points.length - 2);
    creases.forEach(angle => layer
      .line(2.5, 0, 2.5 + Math.cos(angle), 0 + Math.sin(angle))
      .strokeDasharray("0.0333 0.0666")
      .stroke("#158"));
  }

  updateLabel();
};

const rebuildWithCreases = (count) => {
  if (controls) { controls.removeAll(); }
  controls = svg.controls(count)
    .position(() => {
      const angle = Math.random() * Math.PI * 2;
      return [Math.cos(angle), Math.sin(angle)];
    })
    .onChange(onChange, true);
  controls.forEach(p => {
    p.updatePosition = (mouse) => [Math.cos, Math.sin]
      .map(f => f(Math.atan2(mouse.y, mouse.x)))
  });
};

rebuildWithCreases(sliderCount);

if (slider) {
  slider.oninput = (e) => {
    sliderCount = parseInt(e.target.value) * 2 + 1;
    rebuildWithCreases(sliderCount);
    updateLabel(sliderCount);
  };
  slider.oninput({target:{value:2}});
}
