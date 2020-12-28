var slider, countLabel;

const graph = {};
const NUM_EDGES = 40;

const update = (epsilon) => {
  const merged = JSON.parse(JSON.stringify(graph));
  ear.graph.remove_duplicate_vertices(merged, epsilon);

  svg.clear();
  svg.load( ear.svg(merged, {vertices: true, attributes: { edges: {
    mountain: { stroke: "#e53" },
    valley: { stroke: "#158" },
  }}}) );
  svg.size(1,1);
};

const makeNewGraph = () => {
  Object.keys(graph).forEach(key => delete graph[key]);
  graph.vertices_coords = [];
  graph.edges_vertices = [];
  graph.edges_assignment = [];
  for (let i = 0; i < NUM_EDGES; i += 1) {
    graph.vertices_coords.push(
      [Math.random(), Math.random()], [Math.random(), Math.random()]
    );
    graph.edges_vertices.push([i * 2, i * 2 + 1]);
    graph.edges_assignment.push(Math.random() < 0.5 ? "M" : "V");
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

svg.onMove = (e) => {
  const places = -(1 - e.x) * 2.5;
  update(Math.pow(10, places))
};
