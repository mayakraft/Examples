svg.size(1, 1)
	.padding(0.05)
	.strokeWidth(0.01);

const graph = ear.graph.kite();
svg.graph(graph);

const splitGraph = (g, edge, pos) => {
  ear.graph.split_edge(g, edge, [pos[0], pos[1]]);
  svg.removeChildren();
	svg.graph(g);
};

svg.onPress = (event) => {
  const edge = ear.graph.nearest_edge(graph, event.position);
  splitGraph(graph, edge, event.position);
};

svg.onMove = (event) => {
  const edge = ear.graph.nearest_edge(graph, event.position);
  splitGraph(JSON.parse(JSON.stringify(graph)), edge, event.position);
};

