const origamiStyle = {
  attributes: {
    boundaries: {
      stroke: "black",
      "stroke-width": 0.01,
    },
    edges: { 
      "stroke-width": 0.01,
      valley: {
        stroke: "#158",
        "stroke-width": 0.015,
        "stroke-dasharray": "0.02 0.03",
        "stroke-linecap": "round"
      }
    }
  }
};

const foldedStyle = {
  edges: false,
  attributes: {
    faces: {
      "stroke-width": 0.01,
      front: { stroke: "black", fill: "white" },
      back: { stroke: "black", fill: "#fb4" }
    }
  }
};

let origami = {};
let folded = {};

let axiom;  // number 1 through 7
let controls = svg.controls(0);
let result; // solutions to current axiom
let axiomSolutionIndex; // which solution 0,1,2 is being shown

const cpLayer = svg.g().setClass("cp");
const controlLayer = svg.g().setClass("touch-controls");
const marksLayer = svg.g().setClass("marks");
const foldedLayer = svg.g().setClass("folded");
const axiomControlCount = [null, 2, 2, 4, 3, 4, 6, 5];
const axiomPointCount = [null, 2, 2, 0, 1, 2, 2, 1];
const axiomLineCount = [null, 0, 0, 2, 1, 1, 2, 2];

const toAxiomParams = function (points) {
  const numPoints = axiomPointCount[axiom];
  const numLines = axiomLineCount[axiom];
  return {
    points: points.slice().splice(numLines*2),
    lines: Array.from(Array(numLines))
      .map((_, i) => ear.line.fromPoints(points[i*2+0], points[i*2+1]))
  };
};

const drawParams = function (params) {
  marksLayer.removeChildren();
  if (!params.lines) { return; }
  params.lines
    .map(line => ear.graph.clip(origami, line))
    .filter(a => a !== undefined)
    .forEach(s => marksLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
      .strokeWidth(0.01)
      .stroke("#fb4"));
};

const arrowhead = svg.marker()
	.orient("auto-start-reverse")
	.refY(0.5)
	.markerWidth(4)
	.markerHeight(4)
	.setViewBox(0, 0, 1, 1);
const arrowPolygon = arrowhead.polygon(0, 0, 0, 1, Math.sqrt(3)/2, 0.5)
	.fill("black")
	.stroke("none");

const shrinkArrow = (segment) => {
	const mag = ear.math.magnitude(ear.math.subtract(...segment));
};

const controlsOnChange = function (point, i, points) {
  const params = toAxiomParams(points);
  origami = ear.graph.square();
  // origamiSVG.load( ear.svg(origami, origamiStyle) );
  drawParams(params);
	// console.log("axiom params", params);
  // calculate axiom
  result = ear.axiom(axiom, params);
	const tests = ear.axiom.test(axiom, params, origami);
	// console.log("result", result);
	// console.log("tests", tests);
	// console.log("solution index", axiomSolutionIndex);
  // if (result === undefined) { return; }
  // if (result.constructor !== Array) { result = [result]; }
  const foldLine = result.splice(axiomSolutionIndex, 1).shift();
	if (foldLine === undefined) { return; }
  origami = ear.graph.flat_fold(origami, foldLine.vector, foldLine.origin, 0);

	const color = tests[axiomSolutionIndex % tests.length]
		? "black"
		: "#e53";

	origamiStyle.attributes.boundaries.stroke = color;
	origamiStyle.attributes.edges.valley.stroke = tests[axiomSolutionIndex % tests.length]
		? "#158"
		: "#e53";
	arrowPolygon.fill(color);

  result
    // .forEach(line => origami.boundaries[0].clipLine(line)
    .map(line => ear.graph.clip(origami, line))
    .filter(a => a !== undefined)
    .forEach(s => marksLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
      .strokeWidth(0.01)
      .stroke(color)
      .opacity(0.1));
	let axiomArrows = ear.diagram.axiom_arrows(axiom, params, origami);
  if (axiomArrows[0].constructor !== Array) { axiomArrows = [axiomArrows]; }
  const arrows = axiomArrows.splice(axiomSolutionIndex, 1).shift();
	arrows.forEach(seg => marksLayer.curve(seg[0], seg[1], 0.3)
		.stroke(color)
		.fill("none")
		.strokeWidth(0.02)
		.markerEnd(arrowhead));
  folded = JSON.parse(JSON.stringify(origami));
  folded.vertices_coords = ear.graph.make_vertices_coords_folded(folded);
  ear.graph.translate(folded, 1.5, 0);
  cpLayer.removeChildren();
  cpLayer.load( ear.svg(origami, origamiStyle) );
  foldedLayer.removeChildren();
  foldedLayer.load( ear.svg(folded, foldedStyle) );
	svg.size(2.5, 1).padding(0.1);
};

const rebuild = function () {
  controlLayer.removeChildren();
  controls.removeAll();
  controls = svg.controls(axiomControlCount[axiom])
    .svg(() => controlLayer.circle().radius(0.02).fill("#fb4").stroke("none"))
    .position(() => [Math.random(), Math.random()])
    .onChange(controlsOnChange, true);
};

const setAxiom = function (i) {
  axiom = i;
  axiomSolutionIndex = 0;
  rebuild();
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
