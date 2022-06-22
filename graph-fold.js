svg.size(100, 100);
svg.background('transparent');

let graph = ear.graph.unit_square();
svg.load(ear.svg(graph, { vertices: true, attributes: { circle: { r: 0.01 }} }));
svg.size(-0.05, -0.05, 1.1, 1.1);

const topLayer = svg.g();

const origin = [0.5, 0.5];
let angle = 0;

const fold = () => {
  const face = ear.graph.nearest_face(graph, origin);
  if (face === undefined) { return; }
  const line = ear.line([Math.cos(angle), Math.sin(angle)], origin);
  graph = ear.graph.flat_fold(graph, line.vector, line.origin, face, "V");
  svg.removeChildren();
  svg.load(ear.svg(graph, { vertices: true, attributes: { circle: {r: 0.01}} }));
  svg.size(-0.05, -0.05, 1.1, 1.1);
  svg.appendChild(topLayer);
  return graph;
};

svg.onMove = (e) => {
  angle += 0.0333;
  origin[0] = e.x;
  origin[1] = e.y;
  topLayer.removeChildren();
  topLayer.line(
    origin[0], origin[1],
    origin[0] + 0.1*Math.cos(angle),
    origin[1] + 0.1*Math.sin(angle));
};

svg.onPress = () => {
  fold();
};
