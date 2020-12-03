const graph = ear.graph.square();

let mouseX = 0.5;
let mouseY = 0.5;
let angle = 0.1;

const redraw = (graph) => {
  svg.removeChildren();
  svg.load(ear.svg(graph, { vertices: true, attributes: { circle: {r: 0.01}} }));
  svg.size(-0.05, -0.05, 1.1, 1.1);
};

const splitGraph = (graph, face, origin) => {
  const line = ear.line([Math.cos(angle), Math.sin(angle)], [origin.x, origin.y]);
  const result = ear.graph.split_face(graph, face, line.vector, line.origin);
  redraw(graph);
  return result;
};

svg.onPress = (event) => {
  const face = ear.graph.nearest_face(graph, [event.x, event.y]);
  if (face === undefined) { return; }
  const res = splitGraph(graph, face, event);
  if (res && res.edges.new) {
    const edge = res.edges.new[0];
    graph.edges_assignment[edge] = Math.random() < 0.5 ? "M" : "V";
  }
};

svg.play = (event) => {
  angle += 0.05;
  const face = ear.graph.nearest_face(graph, [mouseX, mouseY]);
  if (face === undefined) { redraw(graph); return; }
  splitGraph(JSON.parse(JSON.stringify(graph)), face, { x:mouseX, y:mouseY });
};

svg.onMove = (event) => {
  mouseX = event.x;
  mouseY = event.y;
};

// splitGraph(JSON.parse(JSON.stringify(graph)), 0, { x:mouseX, y:mouseY });
