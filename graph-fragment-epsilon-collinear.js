var slider, countLabel;

const graph = {};
const NUM_EDGES = 10;

const update = (epsilon) => {
  const frag = JSON.parse(JSON.stringify(graph));
  ear.graph.fragment(frag, epsilon);

  svg.clear();
  svg.load( ear.svg(frag, {vertices: true, attributes: {
    svg: { "stroke-width": 0.005 },
    edges: { stroke: "black" },
    circle: { r: 0.0075, stroke: "black", fill: "white" },
  }}) );
  svg.size(svg.getViewBox().map((n, i) => n + [-0.02, -0.02, 0.04, 0.04][i]));
};

const makeNewGraph = () => {
  Object.keys(graph).forEach(key => delete graph[key]);
  graph.vertices_coords = [[0.1, 0.5], [0.9, 0.5]];
  graph.edges_vertices = [[0, 1]];
  for (let i = 0; i < NUM_EDGES; i += 1) {
    const pct = i / (NUM_EDGES-1);
    graph.vertices_coords.push(
      [0.15 + 0.7 * pct, 0.5 + 0.05*pct], [0.15 + 0.7 * pct, 0.9]
    );
    graph.edges_vertices.push([i * 2 + 2, i * 2 + 3]);
  }
  update();
};

makeNewGraph();

if (slider) {
  slider.oninput = (e) => {
    const { value } = event.target;
    const places = -(1 - parseFloat(value / 1000)) * 2.5;
    // console.log("places", places);
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
//   const places = -(1 - e.x) * 2.5;
//   update(Math.pow(10, places))
// };
