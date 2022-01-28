const graph = {
  vertices_coords: [[0,0], [1.2,0], [1.9,0], [3,0], [3,1], [2,1], [1,1], [0,1]],
  edges_vertices: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [6,1], [5,2]],
  edges_foldAngle: [0,0,0,0,0,0,0,0,180,-180],
  edges_assignment: ["B","B","B","B","B","B","B","B","V","M"],
  faces_vertices: [[1,0,7,6], [2,1,6,5], [3,2,5,4]]
};

svg.size(0, -0.5, 5, 2)
	.strokeWidth(1/100);

// draw crease pattern
svg.origami(graph);

// fold crease pattern
const vertices_coords = ear.graph.make_vertices_coords_folded(graph);
const translated = { ...graph, vertices_coords };

// this key tells the renderer to style as if folded instead of a crease pattern
translated.file_classes = ["foldedForm"];

// draw folded
svg.origami(translated).translate(3.5, 0);

