svg.size(-0.1, -0.1, 3, 1.2)
  .strokeWidth(0.01);
const graphLayer = svg.g();

// CP style
const style = {
  attributes: {
    boundaries: { stroke: "black" },
    faces: {
      back: { fill: "white" },
      front: { fill: "#fb4" },
    },
    edges: {
      mountain: { stroke: "black" },
      valley: { stroke: "black", "stroke-dasharray": "0.025 0.015" },
    }
  }
};

// folded form style. same as CP with small changes
const foldedStyle = JSON.parse(JSON.stringify(style));
foldedStyle.edges = false;
foldedStyle.attributes.faces.stroke = "black";
delete foldedStyle.attributes.boundaries;

const graph = ear.graph.square();
// add a vertex in the middle. this vertex will move around.
let vertex = ear.graph.add_vertices(graph, [0.5, 0.5]).shift();
// 3 new edges connecting corners to the new vertex
const edges3 = ear.graph.add_edges(graph, [[vertex, 0], [vertex, 1], [vertex, 2]]);

// keep the point inside the unit square
const limitPoint = (point) => {
  if (point.x < ear.math.EPSILON) { point.x = ear.math.EPSILON; }
  if (point.y < ear.math.EPSILON) { point.y = ear.math.EPSILON; }
  if (point.x > 1 - ear.math.EPSILON) { point.x = 1 - ear.math.EPSILON; }
  if (point.y > 1 - ear.math.EPSILON) { point.y = 1 - ear.math.EPSILON; }
  return point;
};

const update = (point) => {
  point = limitPoint(point);

  // load the 3 crease CP
  const origami = JSON.parse(JSON.stringify(graph));
  window.origami = origami;
  origami.vertices_coords[vertex] = [point.x, point.y];
  // this gives us edges_vector, we need it for the kawasaki calculation
  ear.graph.populate(origami);

  // make a junction that contains the three edges' vectors
  // this automatically sorts them counter-clockwise
  const junction = ear.junction(edges3.map(i => origami.edges_vector[i]));
  // this gives us (possible) solutions for all 3 sectors. the large sector
  // is at index 2, this is the only one we're looking to solve.
  const solution = ear.math.kawasaki_solutions(junction.vectors)[2];
  if (!solution) { return; }

  const ray = ear.ray(solution, origami.vertices_coords[vertex]);
  const segment = ear.graph.clip_line(origami, ray);
  // console.log("segment", segment);
  if (!segment) { return; }

  // one of these will end up being the same vertex as "vertex"
  const new_edge_vertices = ear.graph.add_vertices(origami, segment);
  const new_edge = ear.graph.add_edges(origami, new_edge_vertices).shift();
  // set assignments for the new edge and the middle of the first 3 edges
  ear.graph.fragment(origami);
  ear.graph.populate(origami);

  // fragment rebuilds the graph. need to re-find the vertex at the center
  vertex = ear.graph.nearest_vertex(origami, [point.x, point.y]);

  const sectors = origami.vertices_sectors[vertex];
  const assignments = origami.vertices_edges[vertex]
    .map(edge => origami.edges_assignment[edge]);
  const res = ear.graph.assignment_solver(sectors, assignments);
  if (!res.length) { return; }

  res[0].assignment.forEach((a, i) => {
    origami.edges_assignment[ origami.vertices_edges[vertex][i] ] = a;
  });
  delete origami.edges_foldAngle;
  origami.edges_foldAngle = ear.graph.make_edges_foldAngle(origami);
  // there will be only one solution, but all we need is one anyway
  ear.graph.populate(origami);
  origami["faces_re:layer"] = [];
  // what the algorithm thinks is face 0-4 is actually origami.vertices_faces[vertex];
  // i is face 0-4 (needs to be updated)
  res[0].layer[0].forEach((layer, i) => {
    origami["faces_re:layer"][origami.vertices_faces[vertex][i]] = layer;
  });
  // copy origami, fold the vertices, translate it to the right a little
  const folded = JSON.parse(JSON.stringify(origami));
  folded.vertices_coords = ear.graph.make_vertices_coords_folded(folded);
  const center = ear.math.average(...folded.vertices_coords);
  ear.graph.translate(folded, 2 - center[0], 0.5 - center[1]);

  graphLayer.removeChildren();
  graphLayer.load(ear.svg(origami, style));
  graphLayer.load(ear.svg(folded, foldedStyle));
};

svg.onPress = update;

svg.onMove = (mouse) => {
  if (mouse.buttons) {
    update(mouse);
  }
};

update({
  x: 0.4 + Math.random() * 0.2,
  y: 0.4 + Math.random() * 0.2
});
