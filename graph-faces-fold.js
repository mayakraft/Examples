const graph = {
  vertices_coords: [[0,0], [1.1,0], [1.9,0], [3.2,0], [3.8,0], [5,0], [5,1], [4,1], [3,1], [2,1], [1,1], [0,1]],
  edges_vertices: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8], [8,9], [9,10], [10,11], [11,0], [10,1], [9,2], [8,3], [7,4]],
  edges_foldAngle: [0,0,0,0,0,0,0,0,0,0,0,0,180,-180,180,-180],
  // edges_foldAngle: [0,0,0,0,0,0,0,0,0,0,0,0,20,-40,60,-90],
  edges_assignment: ["B","B","B","B","B","B","B","B","B","B","B","B","V","M","V","M"],
  faces_vertices: [[1,0,11,10], [2,1,10,9], [3,2,9,8], [4,3,8,7], [5,4,7,6]],
};
// most vertices are a part of a few different faces, it doesn't matter
// which face, just assign each vertex to one of its face's matrices, and
// apply that transform.
const faces_matrix = ear.graph.make_faces_matrix(graph);
const vertices_faces = ear.graph.make_vertices_faces(graph);
const vertices_coords = graph.vertices_coords
  .map((coords, i) => ear.math.multiply_matrix3_vector3(
    faces_matrix[vertices_faces[i][0]],
    ear.math.resize(3, coords)
  ));

svg.load(ear.svg({ ...graph, vertices_coords }));

svg.querySelector(".faces").childNodes.forEach(face => {
  face.setAttribute("stroke", "none");
  face.setAttribute("fill", "rgba(0, 0, 0, 0.3)");
});

// ear.graph.get_boundary(folded);

// const foldedRight = {...graph, vertices_coords}
// ear.graph.translate(foldedRight, 2, 0);
// const folded2SVG = ear.svg(foldedRight, {output: "svg"});
// folded2SVG.querySelector(".boundaries").childNodes.forEach(face => {
//   face.setAttribute("fill", "none");
//   face.setAttribute("stroke", "black");
// });
// svg.appendChild(folded2SVG.querySelector(".boundaries"));

// svg.size(-0.5, -0.5, 4.5, 2.5);
