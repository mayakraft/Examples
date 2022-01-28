// const graph = ear.graph({
//   "vertices_coords": [
//     [0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.207106781186548,0.5],[0.5,0.207106781186548],[0.792893218813452,0.5],[0.5,0.792893218813452],[0.353553390593274,0.646446609406726],[0.646446609406726,0.646446609406726],[0.646446609406726,0.353553390593274],[0.353553390593274,0.353553390593274],[0,0.5],[0.5,0],[1,0.5],[0.5,1]
//   ],
//   "edges_vertices": [
//     [3,5],[5,9],[3,9],[3,13],[5,13],[0,5],[0,13],[0,12],[5,12],[4,5],[4,12],[4,9],[0,6],[6,12],[0,14],[6,14],[1,6],[1,14],[1,11],[6,11],[4,6],[4,11],[1,7],[7,11],[1,15],[7,15],[2,7],[2,15],[2,10],[7,10],[4,7],[4,10],[2,8],[8,10],[2,16],[8,16],[3,8],[3,16],[8,9],[4,8]
//   ],
//   "edges_assignment": [
//     "M","F","V","B","V","M","B","F","F","M","F","V","M","F","B","V","M","B","V","F","M","V","M","F","B","V","M","B","F","F","M","F","M","F","B","V","M","B","F","M"
//   ],
//   "faces_vertices": [
//     [3,5,9],[5,3,13],[0,5,13],[5,0,12],[4,5,12],[5,4,9],[0,6,12],[6,0,14],[1,6,14],[6,1,11],[4,6,11],[6,4,12],[1,7,11],[7,1,15],[2,7,15],[7,2,10],[4,7,10],[7,4,11],[2,8,10],[8,2,16],[3,8,16],[8,3,9],[4,8,9],[8,4,10]
//   ],
//   "edges_foldAngle": [
//     -180,0,180,0,180,-180,0,0,0,-180,0,180,-180,0,0,180,-180,0,180,0,-180,180,-180,0,0,180,-180,0,0,0,-180,0,-180,0,0,180,-180,0,0,-180
//   ]
// });

const graph = ear.graph({
  vertices_coords: [[0, 0], [0.4142, 0], [1, 0], [1, 0.5857], [1, 1], [0, 1]],
  edges_vertices: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 1], [3, 5], [5, 2]
  ],
  edges_assignment: ["B", "B", "B", "B", "B", "B", "V", "V", "M"],
});

svg.load(graph.svg());

// console.log(graph)

let mouseX, mouseY;

let angle = 0;

const splitGraph = (graph, face, mouse) => {
  const line = ear.line([Math.cos(angle), Math.sin(angle)], [mouse.x, mouse.y]);
  // const result = ear.core.split_face(graph, face, line.vector, line.mouse);
  svg.removeChildren();
  svg.load(graph.svg());
  // svg.line(line.origin, line.origin.add(line.vector.scale(0.1)))
  //   .strokeWidth(0.005)
  //   .stroke("black");
  graph.faces_matrix = ear.graph.make_faces_matrix(graph, face);
  const lines = graph.faces_matrix.map(matrix => line.transform(matrix));
  lines.forEach(line => svg.line(
      line.origin,
      line.origin.add(line.vector.scale(0.1)))
    .strokeWidth(0.005)
    .stroke("black"));
  // console.log(graph.faces_matrix);
  // svg.circle(mouse).radius(0.02).fill("black");
};

svg.onPress = (event) => {
  const nearest = graph.nearest(event);
  if (nearest.face === undefined) { return; }
  splitGraph(graph, nearest.face.index, event);
};

svg.play = (event) => {
  angle += 0.05;
  if (!graph) { return; }
  const nearest = graph.nearest([mouseX, mouseY]);
  if (nearest.face === undefined) { return; }
  const graphCopy = ear.graph( JSON.parse(JSON.stringify(graph)) );
  splitGraph(graphCopy, nearest.face.index, { x:mouseX, y:mouseY });
};

svg.onMove = (event) => {
  mouseX = event.x;
  mouseY = event.y;
};
