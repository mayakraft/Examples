var slider, countLabel;
svg.size(1, 1)
	.strokeWidth(1 / 200);
const graph = {};
const NUM_EDGES = 20;
const NUM_VERTS = 6;
const NUDGE = 0.015;

let targets = [];

const update = (epsilon) => {
  const merged = JSON.parse(JSON.stringify(graph));
  ear.graph.remove_duplicate_vertices(merged, epsilon);
  ear.graph.populate(merged);

  svg.removeChildren();
	const drawing = svg.graph(merged);
	drawing.vertices.fill("white").stroke("black").childNodes
		.forEach(vert => vert.setRadius(0.005));
	drawing.edges.stroke("black");
	drawing.faces.fill("#fb4");
};

const makeNewGraph = () => {
  Object.keys(graph).forEach(key => delete graph[key]);
  graph.vertices_coords = [];
  graph.edges_vertices = [];
  let targets = Array.from(Array(NUM_VERTS)).map(() => [Math.random(), Math.random()]);
  graph.vertices_coords = Array.from(Array(NUM_EDGES))
    .map(() => [0, 1].map(() => parseInt(Math.random() * targets.length)))
    .filter(pair => pair[0] !== pair[1])
    .map(indices => indices.map(i => targets[i])
      .map(point => point.map(n => n + Math.random() * NUDGE - NUDGE / 2)))
    .reduce((a, b) => a.concat(b), []);
  graph.edges_vertices = Array.from(Array(graph.vertices_coords.length / 2))
    .map((_, i) => [i * 2, i * 2 + 1]);
  update();
};

makeNewGraph();

if (slider) {
  slider.oninput = (e) => {
    const { value } = event.target;
    const places = -(1 - parseFloat(value / 1000)) * 2.0 - 1.0;
    const epsilon = Math.pow(10, places);
    update(epsilon);
    if (countLabel) {
      const epsilonString = epsilon.toFixed(places < 0 ? -places + 1 : 0);    
      countLabel.innerHTML = `epsilon ${epsilonString}`;
    }
  };
}

svg.onPress = makeNewGraph;

// svg.onMove = (e) => {
//   const places = -(1 - e.x) * 2.0 - 1.0;
//   update(Math.pow(10, places))
// };
