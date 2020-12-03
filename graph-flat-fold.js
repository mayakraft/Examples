const style = {
  edges: false,
  attributes: { faces: {
    front: { fill: "#fb4", stroke: "black" },
    back: { fill: "#fff", stroke: "black" },
  }}
};

let graph = ear.graph.square();
ear.graph.populate(graph);

const startAngle = (Math.random()*0.2 + 0.75) * Math.PI;
graph = ear.graph.flat_fold(graph, [Math.cos(startAngle), Math.sin(startAngle)], [0.25, 0.25], 0, "V");
const vertices_coords = ear.graph.make_vertices_coords_folded(graph);
svg.load( ear.svg({ ...graph, vertices_coords }, style));

// svg.load( ear.svg(graph, style) );
svg.size(-0.2, -0.2, 1.4, 1.4);

let touchFaceIndex = 0;
let cachedGraph = JSON.parse(JSON.stringify(graph));
let was_folded = true;
let viewBox = svg.getAttribute("viewBox");

svg.onPress = (mouse) => {
  cachedGraph = JSON.parse(JSON.stringify(graph));
  touchFaceIndex = 0;
};

svg.onRelease = () => {
  graph = cachedGraph;
};

svg.onMove = (mouse) => {
  if (mouse.buttons === 0) { return; }
  const line = ear.axiom["2"]([mouse.x, mouse.y], [mouse.startX, mouse.startY]);
  cachedGraph = ear.graph.flat_fold(graph, line.vector, line.origin, touchFaceIndex, "V");
  svg.clear();
  const vertices_coords = ear.graph.make_vertices_coords_folded(cachedGraph);
  svg.load( ear.svg({ ...cachedGraph, vertices_coords }, style));
  svg.size(-0.2, -0.2, 1.4, 1.4);
};
