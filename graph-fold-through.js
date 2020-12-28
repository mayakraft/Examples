const graph = {vertices_coords: [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.207106781186548,0.5],[0.5,0.207106781186548],[0.792893218813452,0.5],[0.5,0.792893218813452],[0.353553390593274,0.646446609406726],[0.646446609406726,0.646446609406726],[0.646446609406726,0.353553390593274],[0.353553390593274,0.353553390593274],[0,0.5],[0.5,0],[1,0.5],[0.5,1]],edges_vertices: [[3,5],[5,9],[3,9],[3,13],[5,13],[0,5],[0,13],[0,12],[5,12],[4,5],[4,12],[4,9],[0,6],[6,12],[0,14],[6,14],[1,6],[1,14],[1,11],[6,11],[4,6],[4,11],[1,7],[7,11],[1,15],[7,15],[2,7],[2,15],[2,10],[7,10],[4,7],[4,10],[2,8],[8,10],[2,16],[8,16],[3,8],[3,16],[8,9],[4,8]],edges_assignment: ["M","F","V","B","V","M","B","F","F","M","F","V","M","F","B","V","M","B","V","F","M","V","M","F","B","V","M","B","F","F","M","F","M","F","B","V","M","B","F","M"]};

ear.graph.populate(graph);
svg.load(ear.svg(graph));

let angle = 0;
let mouse = [0.25, 0.25];
let other_point = [0.5, 0.5];

const update = () => {
  const face = ear.graph.nearest_face(graph, mouse);
  if (face === undefined) { return; }
  // const vector = [Math.cos(angle), Math.sin(angle)];
  const vector = ear.math.subtract(other_point, ear.math.add(mouse, [1.5, 0.5]));
  const result = ear.graph.flat_fold(graph, vector, mouse, face, "V");
  svg.clear();
  svg.load(ear.svg(result));
  
  delete result.vertices_vertices;
  delete result.vertices_edges;
  delete result.vertices_faces;
  delete result.vertices_sectors;
  delete result.edges_edges;
  delete result.edges_faces;
  // delete result.edges_foldAngle;
  // delete result.edges_assignment;
  delete result.edges_length;
  delete result.edges_vector;
  delete result.faces_faces;
  delete result.faces_matrix;
  delete result.planar_faces;
  // console.log("tree", ear.graph.make_face_spanning_tree(result));
  result.faces_matrix = ear.graph.make_faces_matrix(result);
  result.vertices_faces = ear.graph.make_vertices_faces(result);
  // console.log("result.faces_matrix", result.faces_matrix);
  ear.graph.populate(result);
  // console.log(result);

  result.vertices_coords = ear.graph
    .make_vertices_coords_folded(result, 0);
  // console.log(result.vertices_coords);
  ear.graph.translate(result, 1.5, 0.5);
  svg.load(ear.svg(result, { attributes: {
    edges: { mountain: { stroke: "black" }, valley: { stroke: "black" }},
    faces: { fill: "#0002" },
  }}));
  svg.size(0, 0, 2.25, 1);
};

svg.onMove = (e) => {
  // mouse = [e.x, e.y];
  other_point = [e.x, e.y];
  update();
};

// svg.play = (e) => {
//   angle += 0.01;
//   update();
// };

// update();