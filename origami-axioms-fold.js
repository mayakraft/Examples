var callback;

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

const arrowhead = svg.marker()
	.orient("auto-start-reverse")
	.refY(0.5)
	.markerWidth(4)
	.markerHeight(4)
	.setViewBox(0, 0, 1, 1);
const arrowPolygon = arrowhead.polygon(0, 0, 0, 1, Math.sqrt(3)/2, 0.5)
	.fill("black")
	.stroke("none");

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
	foldedLayer.removeChildren();
  makeParamLines(params)
		.forEach(line => marksLayer.appendChild(line));
  let result = ear.axiom(axiom, params);
	const tests = ear.axiom.test(axiom, params, ear.graph.square());
  // result
  //   .map(line => boundary.clipLine(line))
  //   .filter(a => a !== undefined)
  //   .forEach(seg => resultLayer.line(seg[0], seg[1]));

	const color = tests[axiomSolutionIndex % tests.length]
		? "black"
		: "#e53";
	origamiStyle.attributes.boundaries.stroke = color;
	origamiStyle.attributes.edges.valley.stroke = tests[axiomSolutionIndex % tests.length]
		? "#158"
		: "#e53";
	arrowPolygon.fill(color);

  const foldLine = result.splice(axiomSolutionIndex, 1).shift();
	if (foldLine === undefined) {
		// axiom is not constructible
		resultLayer.graph(ear.graph.square());
  	// resultLayer.load( ear.svg(ear.graph.square(), origamiStyle) );
		return;
	}

  const origami = ear.graph.flat_fold(ear.graph.square(), foldLine.vector, foldLine.origin);
  result
    // .forEach(line => origami.boundaries[0].clipLine(line)
    .map(line => ear.graph.clip_line(origami, line))
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
  const folded = JSON.parse(JSON.stringify(origami));
  folded.vertices_coords = ear.graph.make_vertices_coords_folded(folded);
  ear.graph.translate(folded, 1.5, 0);

	const cpDraw = resultLayer.graph(origami);
	const foldDraw = foldedLayer.graph(folded);
	
	svg.size(2.5, 1).padding(0.1);

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

