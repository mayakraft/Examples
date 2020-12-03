svg.stroke("black")
  .strokeWidth(0.01)
  .strokeLinecap("round");

const list = [12, 11, 6, 2, 3, 4, 5, 9];
const listsum = list.reduce((a, b) => a + b, 0);
const sectors = list.map(l => l / listsum * Math.PI * 2);
const assignments = ["V", "V", "V", "M", "V", "V", "M", "M"];

const layers = ear.graph.layer_solver(sectors, assignments)
  .shift();

const yscale = 0.03;

let position = 0;
let maxX = 0; // used for viewBox
sectors.forEach((sec, i) => {
  const nextPos = position + (i % 2 === 0 ? sec : -sec);
  svg.line(position, layers[i] * yscale, nextPos, layers[i] * yscale);
  const nextLayer = layers[(i + 1) % layers.length];
  const updown = (layers[i] > nextLayer) ? 0 : 1;
  const dir = (assignments[(i + 1) % assignments.length] === "V" || assignments[(i + 1) % assignments.length] === "v") ? updown : 1 - updown;
  const midy = (layers[i] * yscale + nextLayer * yscale) / 2;
  const r = Math.abs((layers[i] * yscale - nextLayer * yscale) / 2);
  svg.arc(nextPos, midy, r, ...[[Math.PI/2, Math.PI*3/2], [Math.PI*3/2, Math.PI/2]][dir]).fill("none");
  position = nextPos;
  if (position > maxX) { maxX = position; }
});

const pad = layers.length * yscale;
svg.size(-pad/2, 0, maxX + pad, layers.length * yscale);
