const style = {
  edges: false,
  attributes: { faces: {
    front: { fill: "#fff", stroke: "black" },
    back: { fill: "#fb4", stroke: "black" },
  }}
};

svg.size(2.25, 1)
	.padding(0.2)
	.strokeWidth(0.01);

const bottom = svg.g();
const top = svg.g();

const angle = (Math.random()*0.2 + 0.75) * Math.PI;
let graph = ear.graph.flat_fold(ear.graph.unit_square(), [Math.cos(angle), Math.sin(angle)], [0.25, 0.25]);
const vertices_coords = ear.graph.make_vertices_coords_folded(graph);
top.load( ear.svg({ ...graph, vertices_coords }, style));
const cp = ear.graph.translate(JSON.parse(JSON.stringify(graph)), 1.25, 0);
bottom.load( ear.svg(cp, { attributes: { boundaries: { stroke: "black"  }}}) );

let cachedGraph = JSON.parse(JSON.stringify(graph));

svg.onPress = (mouse) => {
  cachedGraph = JSON.parse(JSON.stringify(graph));
};

svg.onRelease = () => {
  graph = cachedGraph;
};

svg.onMove = (mouse) => {
  if (mouse.buttons === 0) { return; }
  const line = ear.axiom[2](mouse.press, mouse.position);
  cachedGraph = ear.graph.flat_fold(graph, line.vector, line.origin);
  top.removeChildren();
	bottom.removeChildren();
  const vertices_coords = ear.graph.make_vertices_coords_folded(cachedGraph);
  top.load( ear.svg({ ...cachedGraph, vertices_coords }, style));
  const cp = ear.graph.translate(JSON.parse(JSON.stringify(cachedGraph)), 1.25, 0);
  bottom.load( ear.svg(cp, { attributes: { boundaries: { stroke: "black"  }}}) );
};

