var callback;

svg.size(1, 1)
	.strokeWidth(0.02);
const resultLayer = svg.g()
	.stroke("black")
	.strokeLinecap("round")
	.strokeDasharray("0.05")
const marksLayer = svg.g().stroke("#fb4");
const controlLayer = svg.g()
	.fill("#fb4")
	.stroke("none");

let axiom;  // number 1 through 7
let controls = svg.controls(0);
const boundary = ear.rect(-1, -1, 2, 2).scale(2);

const axiomPointCount = [null, 2, 2, 0, 1, 2, 2, 1];
const axiomLineCount = [null, 0, 0, 2, 1, 1, 2, 2];
const axiomControlCount = axiomPointCount
	.map((_, i) => axiomPointCount[i] + axiomLineCount[i] * 2);

const pointsToAxiomParams = (points) => ({
	points: points.slice().splice(axiomLineCount[axiom] * 2),
	lines: Array.from(Array(axiomLineCount[axiom]))
		.map((_, i) => ear.line.fromPoints(points[i*2+0], points[i*2+1]))
});

const makeParamLines = params => params.lines === undefined
	? []
	: params.lines
    .map(line => boundary.clipLine(line))
    .filter(a => a !== undefined)
    .map(seg => ear.svg.line(seg[0], seg[1]));

const onChange = (point, i, points) => {
  const params = pointsToAxiomParams(points);
  marksLayer.removeChildren();
	resultLayer.removeChildren();
  makeParamLines(params)
		.forEach(line => marksLayer.appendChild(line));
  let result = ear.axiom(axiom, params);
  if (result === undefined) { return; }
  if (result.constructor !== Array) { result = [result]; }
  result
    .map(line => boundary.clipLine(line))
    .filter(a => a !== undefined)
    .forEach(seg => resultLayer.line(seg[0], seg[1]));
	if (callback) {
		callback({ params, result });
	}
};

const reset = () => {
  controlLayer.removeChildren();
  controls.removeAll();
  controls = svg.controls(axiomControlCount[axiom])
    .svg(() => controlLayer.circle(0.04))
    .position(() => [Math.random(), Math.random()])
    .onChange(onChange, true);
};

const setAxiom = (i) => {
  axiom = i;
  reset();
};

setAxiom(2);

