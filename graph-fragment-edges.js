var slider, countLabel;

const graph = {};
const NUM_EDGES = 15;

svg.size(1, 1).strokeWidth(0.005);
const layer = svg.g().strokeWidth(0.015);

const reset = () => {
  Object.keys(graph).forEach(key => delete graph[key]);
  graph.vertices_coords = [];
  graph.edges_vertices = [];

  for (let i = 0; i < NUM_EDGES; i += 1) {
    graph.vertices_coords.push(
      [Math.random(), Math.random()], [Math.random(), Math.random()]
    );
    graph.edges_vertices.push([i * 2, i * 2 + 1]);
  }

  ear.graph.fragment(graph);
  ear.graph.populate(graph);
	svg.removeChildren();
	let drawing = svg.graph(graph);
	drawing.vertices.fill("white").stroke("#e53");
	drawing.vertices.childNodes.forEach(v => v.setRadius(0.0075));
	drawing.edges.stroke("#e53");
  layer.removeChildren();
  svg.appendChild(layer);
};

reset();

const highlightEdge = (index) => {
  if (index < 0) { index = 0; }
  if (index > graph.edges_vertices.length - 1) {
    index = graph.edges_vertices.length - 1;
  }
  layer.removeChildren();
  layer.line(...graph.edges_vertices[index].map(v => graph.vertices_coords[v]))
    .stroke("black");
  if (countLabel) {
    countLabel.innerHTML = `edge ${index+1}/${graph.edges_vertices.length}`;
  }
};

if (slider) {
  slider.oninput = (e) => {
    highlightEdge(parseInt(e.target.value / 1000 * graph.edges_vertices.length));
  };
}

svg.onPress = reset;

