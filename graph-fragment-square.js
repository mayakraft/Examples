const graph = ear.graph.square();

for (let i = 0; i < 4; i += 1) {
  ear.graph.add_edges(
    graph,
    ear.graph.add_vertices(graph, [[Math.random(), 0], [Math.random(), 1]])
  );
  ear.graph.add_edges(
    graph,
    ear.graph.add_vertices(graph, [[0, Math.random()], [1, Math.random()]])
  );
}

ear.graph.fragment(graph);
ear.graph.populate(graph);

svg.load( ear.svg(graph, { vertices: true }) );
const edgeLayer = svg.g();
svg.appendChild(svg.querySelector(".vertices"));
svg.size(1,1).padding(0.02);

svg.onMove = (e) => {
  const vertex = ear.graph.nearest_vertex(graph, [e.x, e.y]);
  const edge = ear.graph.nearest_edge(graph, [e.x, e.y]);
  const face = ear.graph.nearest_face(graph, [e.x, e.y]);
  svg.querySelector(".vertices").childNodes
    .forEach(vertex => vertex.fill("black"));
  svg.querySelector(".faces").childNodes
    .forEach(face => face.fill("none"));
  edgeLayer.removeChildren();
  if (vertex !== undefined) {
    svg.querySelector(".vertices").childNodes[vertex].fill("#e53");
  }
  if (edge !== undefined) {
    edgeLayer.line(graph.edges_vertices[edge].map(v => graph.vertices_coords[v]))
      .stroke("#38b");
  }
  if (face !== undefined) {
    svg.querySelector(".faces").childNodes[face].fill("#fb4");
  }
};
