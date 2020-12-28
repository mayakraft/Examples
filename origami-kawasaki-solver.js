var slider; // HTML slider input
var countLabel; // HTML <p> element

svg.size(-1.1, -1.1, 2.2, 2.2)
  .strokeWidth(0.033)
  .strokeLinecap("round");
const layer = svg.g();
svg.circle(1)
  .fill("none")
  .stroke("black");

let controls;
let solutions = [];
let sliderCount = 5

const updateLabel = () => {
  if (countLabel) {
    countLabel.innerHTML = `<b>${sliderCount} inputs, <red>${solutions.length} result${solutions.length > 1 ? "s" : ""}</red></b>`;
  }
};

const onChange = (p, i, points) => {
  layer.removeChildren();

  points.map(p => ear.ray(p))
    .map(ray => ray.normalize())
    .forEach(r => layer.line(r.origin, r.origin.add(r.vector)).stroke("black"));

  const radians = points
    .map(v => Math.atan2(v[1], v[0]))
    .sort((a, b) => a - b);

  solutions = ear.math.kawasaki_solutions_radians(radians)
    .filter(s => s !== undefined)
    .map(angle => [Math.cos(angle), Math.sin(angle)])
    .map(vec => layer.line(0, 0, ...vec).stroke("#e53"));

  updateLabel();
};

const rebuildWithCreases = (count) => {
  if (controls) { controls.removeAll(); }
  controls = svg.controls(count)
    .position((_, i) => {
      const randomNudge = Math.random() * Math.PI * 2 / count / 2;
      const angle = Math.PI * 2 / count * i + randomNudge;
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
