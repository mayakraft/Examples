// const origami = ear.graph({
//   vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
//   edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0]],
//   edges_assignment: ["B", "B", "B", "B"],
// });

let origami = ear.graph({
  vertices_coords: [[0, 0], [0.4142, 0], [1, 0], [1, 0.5857], [1, 1], [0, 1]],
  edges_vertices: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 1], [3, 5], [5, 2]
  ],
  edges_assignment: ["B", "B", "B", "B", "B", "B", "V", "V", "F"],
});

window.origami = origami;
origami.populate();
svg.load(origami.svg());

let mouseX, mouseY;

let angle = 0;

const splitGraph = (graph, face, origin) => {
  const line = ear.line([Math.cos(angle), Math.sin(angle)], [origin.x, origin.y]);
  const result = ear.core.flat_fold(graph, line.vector, line.origin, 0, "V");
  console.log("result", result);
  svg.removeChildren();
  origami = ear.graph(result);
  graph = origami;
  svg.load(graph.svg());
  return result;
};

svg.onPress = (event) => {
  const nearest = origami.nearest(event);
  if (!nearest.face || nearest.face.index === undefined) { return; }
  const res = splitGraph(origami, nearest.face.index, event);
};

svg.play = (event) => {
  angle += 0.05;
  // const nearest = origami.nearest([mouseX, mouseY]);
  // if (!nearest.face || nearest.face.index === undefined) { return; }
  // const graph = ear.graph( JSON.parse(JSON.stringify(origami)) );
  // splitGraph(graph, nearest.face.index, { x:mouseX, y:mouseY });
};

svg.onMove = (event) => {
  mouseX = event.x;
  mouseY = event.y;
};
