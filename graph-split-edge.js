const graph = ear.graph.kite();
svg.load(ear.svg(graph, { vertices: true, attributes: { circle: { r: 0.01 }} }));
svg.size(-0.05, -0.05, 1.1, 1.1);

const splitGraph = (g, edge, mouse) => {
  const res = ear.graph.split_edge(g, edge, [mouse.x, mouse.y]);
  svg.removeChildren();
  svg.load(ear.svg(g, { vertices: true, attributes: { circle: { r: 0.01 }} }));
  svg.size(-0.05, -0.05, 1.1, 1.1);
  return res;
};

svg.onPress = (mouse) => {
  const edge = ear.graph.nearest_edge(graph, [mouse.x, mouse.y]);
  const res = splitGraph(graph, edge, mouse);
};

svg.onMove = (mouse) => {
  const edge = ear.graph.nearest_edge(graph, [mouse.x, mouse.y]);
  splitGraph(JSON.parse(JSON.stringify(graph)), edge, mouse);
};
