let origami = ear.graph({
  vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
  edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0]],
  edges_assignment: ["B", "B", "B", "B"],
});
window.origami = origami;
origami.populate();

svg.load(origami.svg());

let mouseX, mouseY;

let angle = 0;

const splitGraph = (graph, face, origin) => {
  const line = ear.line([Math.cos(angle), Math.sin(angle)], [origin.x, origin.y]);
  // console.log(line.vector, line.origin)
  const result = ear.core.flat_fold(graph, line.vector, line.origin, 0, "V");
  console.log(result);
  svg.removeChildren();
  origami = ear.graph(result);
  svg.load(origami.svg());
  // svg.load(ear.graph(result).svg());
};

svg.onPress = (event) => {
  const nearest = origami.nearest(event);
  if (!nearest.face || nearest.face.index === undefined) { return; }

  // splitGraph(origami, nearest.face.index, event);

  const graph = ear.graph( JSON.parse(JSON.stringify(origami)) );
  splitGraph(graph, nearest.face.index, { x:mouseX, y:mouseY });
};

// svg.play = (event) => {
//   angle += 0.05;
//   const nearest = origami.nearest([mouseX, mouseY]);
//   if (!nearest.face || nearest.face.index === undefined) { return; }
//   const graph = ear.graph( JSON.parse(JSON.stringify(origami)) );
//   splitGraph(graph, nearest.face.index, { x:mouseX, y:mouseY });
// };

svg.onMove = (event) => {
  angle += 0.05;
  mouseX = event.x;
  mouseY = event.y;
};
