const graph = ear.graph.square();

let mouseX = 0.5;
let mouseY = 0.5;
let angle = 0.1;

const redraw = (graph) => {
  svg.removeChildren();
  svg.load(ear.svg(graph, {
    vertices: true,
    attributes: {
      circle: { r: 0.01 },
      edges: {
        mountain: { stroke: "#e53" },
        valley: { stroke: "#158" },
      },
    }
  }));
  svg.size(-0.05, -0.05, 1.1, 1.1);
    
  // draw exploded faces, shrink to make them more visible
  const exploded = ear.graph.explode_faces(graph);
  exploded.vertices_coords = exploded.faces_vertices.map(face => {
    const verts = face.map(v => exploded.vertices_coords[v]);
    const center = ear.math.centroid(verts);
    return verts.map(v => ear.math.lerp(v, center, 0.5));
  }).reduce((a, b) => a.concat(b), []);
  svg.g().load( ear.svg(exploded, {
    edges: false,
    attributes: {
      faces: {
        front: { fill: "#fb4" },
        back: { fill: "#fb4" },
      }
    }
  }));
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
  if (res) {
    const edge = res.edges.new;
    graph.edges_assignment[edge] = Math.random() < 0.5 ? "M" : "V";
  }
  //console.log(res);
};

svg.play = (event) => {
  angle += 0.05;
  const face = ear.graph.nearest_face(graph, [mouseX, mouseY]);
  if (face === undefined) { redraw(graph); return; }
  splitGraph(JSON.parse(JSON.stringify(graph)), face, { x:mouseX, y:mouseY });
};
redraw(graph);

svg.onMove = (event) => {
  mouseX = event.x;
  mouseY = event.y;
};

// splitGraph(JSON.parse(JSON.stringify(graph)), 0, { x:mouseX, y:mouseY });
