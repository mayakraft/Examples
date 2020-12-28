svg.size(-1.1, -1.1, 7.5, 2.2);
svg.strokeWidth(0.033);
svg.strokeLinecap("round");

svg.circle(1).fill("white").stroke("black");
svg.circle(2.5, 0, 1).fill("white").stroke("black");

var slider; // HTML slider input
var countLabel; // HTML <p> element
var layer = svg.g();
var controls;
var layerLayer = svg.g().stroke("black");
layerLayer.translate(4.3, 0);

var solutions = [];
var sliderCount = 5;

const updateLabel = () => {
  if (countLabel) {
    countLabel.innerHTML = `${sliderCount} inputs, ${solutions.length} solution${solutions.length > 1 ? "s" : ""}`;
  }
};

const onChange = (p, i, points) => {
  layer.removeChildren();
  layerLayer.removeChildren();

  points.map(p => ear.ray(p))
    .map(ray => ray.normalize())
    .forEach(r => layer.line(r.origin, r.origin.add(r.vector))
      .stroke("#e53"));

  var radians = points
    .map(v => Math.atan2(v[1], v[0]))
    .sort((a, b) => a - b);

  solutions = ear.math.kawasaki_solutions_radians(radians)
    .filter(s => s !== undefined);
  solutions.forEach(angle => layer
    .line(0, 0, Math.cos(angle), Math.sin(angle))
    // .strokeDasharray("0.0333 0.0666")
    .stroke("#fb4"));

  if (solutions.length === points.length) {
    points.map(p => ear.ray(p, [2.5, 0]))
      .map(ray => ray.normalize())
      .forEach(r => layer.line(r.origin, r.origin.add(r.vector))
        .stroke("#000"));
    const creases = solutions.slice(0, points.length - 2);
    creases.forEach(angle => layer
      .line(2.5, 0, 2.5 + Math.cos(angle), 0 + Math.sin(angle))
      .strokeDasharray("0.0333 0.0666")
      .stroke("#000"));

    const junction = ear.junction.fromRadians(...radians, ...creases);
    const assignments_unsorted = Array(points.length).fill("V")
      .concat(Array(creases.length).fill("M"));

    const invert = [];
    junction.order.forEach((n, i) => { invert[n] = i; });

    const assignments = invert.map(i => assignments_unsorted[i]);
    const sectors = junction.sectors;
    // assignments.push(assignments.shift());
    // assignments.unshift(assignments.pop());

    const layerSolutions = ear.graph.layer_solver(sectors, assignments);
    const layers = layerSolutions[0];
    // console.log(assignments_unsorted, assignments, junction.order, invert);
    // console.log(assignments, sectors, layerSolutions);
    if (layers === undefined) { console.log("no solution"); return; }

    const yscale = 0.06;
    let position = 0;
    sectors.forEach((sec, i) => {
      const nextPos = position + (i % 2 === 0 ? sec : -sec);
      layerLayer.line(position, layers[i] * yscale, nextPos, layers[i] * yscale)
      const nextLayer = layers[(i + 1) % layers.length];
      const updown = (layers[i] > nextLayer) ? 0 : 1;
      const dir = (assignments[(i + 1) % assignments.length] === "V" || assignments[(i + 1) % assignments.length] === "v") ? updown : 1 - updown;
      const midy = (layers[i] * yscale + nextLayer * yscale) / 2;
      const r = Math.abs((layers[i] * yscale - nextLayer * yscale) / 2);
      layerLayer.arc(nextPos, midy, r, ...[[Math.PI/2, Math.PI*3/2], [Math.PI*3/2, Math.PI/2]][dir]).fill("none");
      position = nextPos;
    });

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
