svg.size(1, 1)
	.padding(0.05)
	.strokeWidth(1 / 100);

const graph = ear.graph.square();

let mouse = ear.vector(0.5, 0.5);
let angle = 0.1;

const redraw = (graph) => {
  svg.removeChildren();
	svg.origami(graph);
  // draw exploded faces, shrink to make them more visible
  const exploded = ear.graph.explode_faces(graph);
  exploded.vertices_coords = exploded.faces_vertices.map(face => {
    const verts = face.map(v => exploded.vertices_coords[v]);
    const center = ear.math.centroid(verts);
    return verts.map(v => ear.math.lerp(v, center, 0.5));
  }).reduce((a, b) => a.concat(b), []);
	ear.graph.svg.faces(exploded)
		.appendTo(svg)
		.fill("#fb4");
};

const splitGraph = (graph, face, origin) => {
	const line = ear.line.fromAngle(angle).translate(origin);
  const result = ear.graph.split_face(graph, face, line.vector, line.origin);
  redraw(graph);
  return result;
};

svg.onPress = (event) => {
  const face = ear.graph.nearest_face(graph, event.position);
  if (face === undefined) { return; }
  const res = splitGraph(graph, face, event);
  if (res) {
    const edge = res.edges.new;
    graph.edges_assignment[edge] = Math.random() < 0.5 ? "M" : "V";
  }
};

svg.onMove = (event) => {
	mouse = event.position;
};

svg.play = (event) => {
  angle += 0.05;
  const face = ear.graph.nearest_face(graph, mouse);
  if (face === undefined) { redraw(graph); return; }
  splitGraph(JSON.parse(JSON.stringify(graph)), face, mouse);
};

redraw(graph);

