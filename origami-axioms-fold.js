var callback;

svg.size(1, 1).strokeWidth(0.02);
const resultLayer = svg.g()
const controlLayer = svg.g()
	.fill("#fb4")
	.stroke("none");
const marksLayer = svg.g().stroke("#fb4");
const foldedLayer = svg.g();

let axiom;  // number 1 through 7
let axiomSolutionIndex; // which solution 0,1,2 is being shown
let controls = svg.controls(0);
const boundary = ear.rect(1, 1);

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
		.map(line => boundary.clip(line))
		.filter(a => a !== undefined)
		.map(seg => ear.svg.line(seg[0], seg[1]));

const onChange = (point, i, points) => {
	const params = pointsToAxiomParams(points);
	marksLayer.removeChildren();
	resultLayer.removeChildren();
	foldedLayer.removeChildren();
	makeParamLines(params)
		.forEach(line => marksLayer.appendChild(line));
	// the simple approach. this runs the test for you.
	// const solutions = ear.axiom(axiom, params, boundary);

	// the longer approach. manually filter. we need this data for visualization
	const solutions = ear.axiom(axiom, params);
	// console.log("solutions", solutions);
	const valid = ear.axiom.validate(axiom, params, boundary);
	// console.log("valid", valid);
	const isValid = valid[axiomSolutionIndex % valid.length];
	// console.log("isValid", isValid);

	// color components if it passes or fails the validation
	const color = isValid ? "black" : "#e53";
	const options = isValid
		? {}
		: ({ boundaries: { stroke: "#e53" }, edges: { stroke: "#e53" } });

	const foldLine = solutions.splice(axiomSolutionIndex, 1).shift();
	if (foldLine === undefined) {
		// axiom is not constructible
		resultLayer.origami(ear.graph.unit_square(), options);
		return;
	}
	const origami = ear.origami().flatFold(foldLine);

	solutions
		.map(line => ear.graph.clip(origami, line))
		.filter(a => a !== undefined)
		.forEach(s => marksLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
			.strokeWidth(0.01)
			.stroke(color)
			.opacity(0.1));

	const arrow = ear.diagram.simple_arrow(origami, foldLine);
	if (arrow === undefined) {
		resultLayer.origami(ear.graph.unit_square(), options);
		return;
	}
	// console.log("6 error here", origami, foldLine);
	marksLayer.arrow(arrow)
		.fill(color)
		.stroke("none")
		.getLine()
		.fill("none")
		.strokeWidth(0.02)
		.stroke(color);

	const cpDraw = resultLayer.origami(origami, options);
	const foldDraw = foldedLayer.origami(origami.folded())
		.translate(1.5, 0);
	
	svg.size(2.5, 1).padding(0.1);

	if (callback) {
		callback({ params, solutions });
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
	axiomSolutionIndex = 0;
	reset();
};

svg.onRelease = function (mouse) {
//   if (mouse.drag.x === 0 && mouse.drag.y === 0) {
//     axiomSolutionIndex = result.solutions
//       .map(line => line.nearestPoint(mouse))
//       .map(point => point.distanceTo(mouse))
//       .map((d, i) => ({ d, i }))
//       .sort((a, b) => a.d - b.d)
//       .shift().i;
//     controlsOnChange(controls);
//   }
};

setAxiom(2);
