var slider, countLabel;

const graph = {};
const NUM_EDGES = 20;
const NUM_VERTS = 6;
const NUDGE = 0.015;

let targets = [];

const update = (epsilon) => {
  const merged = JSON.parse(JSON.stringify(graph));
  ear.graph.merge_duplicate_vertices(merged, epsilon);
  ear.graph.populate(merged);

  svg.clear();
  svg.load( ear.svg(merged, {vertices: true, attributes: { 
    circle: {
      fill: "white",
      r: 0.005,
      stroke: "black",
      "stroke-width": 0.005,
    },
    edges: {
      unassigned: { stroke: "black" },
    },
    faces: {
      front: { fill: "#fb4" },
      back: { fill: "#fb4" },
    }
  }}) );

  svg.size(...svg.getViewBox().map((n, i) => n + [-0.05, -0.05, 0.1, 0.1][i] ));
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
