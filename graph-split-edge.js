svg.size(1, 1)
	.padding(0.05)
	.strokeWidth(0.01);

const graph = ear.graph.kite();
svg.origami(graph);

const splitGraph = (g, edge, pos) => {
  ear.graph.splitEdge(g, edge, [pos[0], pos[1]]);
  svg.removeChildren();
	svg.origami(g);
};

svg.onPress = (event) => {
  const edge = ear.graph.nearestEdge(graph, event.position);
  splitGraph(graph, edge, event.position);
};

svg.onMove = (event) => {
  const edge = ear.graph.nearestEdge(graph, event.position);
  splitGraph(JSON.parse(JSON.stringify(graph)), edge, event.position);
};

