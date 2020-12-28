const style = {
  edges: false,
  attributes: { faces: {
    front: { fill: "#fff", stroke: "black" },
    back: { fill: "#fb4", stroke: "black" },
  }}
};

let graph = ear.graph.square();

const angle = (Math.random()*0.2 + 0.75) * Math.PI;
graph = ear.graph.flat_fold(graph, [Math.cos(angle), Math.sin(angle)], [0.25, 0.25]);
const vertices_coords = ear.graph.make_vertices_coords_folded(graph);

svg.load( ear.svg({ ...graph, vertices_coords }, style));
svg.size(1, 1).padding(0.05);

let dragGraph = JSON.parse(JSON.stringify(graph));

svg.onPress = () => { dragGraph = JSON.parse(JSON.stringify(graph)); };

svg.onRelease = () => { graph = dragGraph; };

svg.onMove = (mouse) => {
  if (mouse.buttons === 0) { return; }
  const line = ear.axiom["2"]([mouse.x, mouse.y], [mouse.startX, mouse.startY]);
  dragGraph = ear.graph.flat_fold(graph, line.vector, line.origin);
  const vertices_coords = ear.graph.make_vertices_coords_folded(dragGraph);
  svg.clear();
  svg.load( ear.svg({ ...dragGraph, vertices_coords }, style));
  svg.size(1, 1).padding(0.05);
};
