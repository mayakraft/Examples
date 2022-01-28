const COUNT = 10;
const graph = {};
let vertex_map = [];
const speeds = Array.from(Array(COUNT)).map(() => [0, 1].map(() => Math.random()));
const offsets = Array.from(Array(COUNT)).map(() => [0, 1].map(() => Math.random() * Math.PI * 2));

let timer = undefined;

svg.size(-0.1, -0.1, 1.2, 1.2);
svg.style(`@keyframes dup-vertices-spark-frames {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(7); }
}
.dup-vertices-spark {
  animation: dup-vertices-spark-frames 0.3s ease-out normal forwards;
}
`);

svg.size(1, 1).strokeWidth(0.015);

const graphLayer = svg.g();
const animLayer = svg.g();

const resetGraph = () => {
  if (timer !== undefined) {
    clearTimeout(timer);
    timer = undefined;
  }
  animLayer.removeChildren();
  Object.keys(graph).forEach(key => delete graph[key]);
  graph.vertices_coords = Array.from(Array(COUNT))
    .map(() => [0, 1].map(() => Math.random()));
  graph.edges_vertices = Array.from(Array(12))
    .map(() => [Math.random(), Math.random()]
      .map(n => parseInt(n * graph.vertices_coords.length)));
  vertex_map = graph.vertices_coords.map((_, i) => i)

  ear.graph.clean(graph);
  const isolated = ear.graph.get_isolated_vertices(graph);
  ear.graph.remove(graph, "vertices", isolated);
};

resetGraph();

const draw = () => {
  graphLayer.removeChildren();
  const drawing = graphLayer.origami(graph, false);
  drawing.vertices
    .stroke("black")
    .fill("white")
    .childNodes
    .forEach(vert => vert.setRadius(0.02));
  drawing.edges.stroke("black");
};

draw();

const animUpdate = () => {
  const result = ear.graph.remove_duplicate_vertices(graph, 0.02);
  if (result.remove.length) {
    if (graph.vertices_coords.length < 5 && timer === undefined) {
      timer = setTimeout(resetGraph, 5000);
    }
    if (graph.vertices_coords.length < 4) {
      if (timer) { clearTimeout(timer); }
      timer = setTimeout(resetGraph, 1000);
    }
    result.remove.sort((a,b) => b - a).forEach(i => vertex_map.splice(i, 1));
    const new_verts = result.remove.map(i => result.map[i]);
    const coord = graph.vertices_coords[new_verts[0]];
    const circle = animLayer.circle(...coord, 0.015)
      .fill("#000");
    circle.setAttribute("class", "dup-vertices-spark");
    circle.setAttribute("transform-origin", `${coord[0]}px ${coord[1]}px`);
  }
};

let t = 0;

svg.play = (e) => {
  animUpdate();
  t += 1;
  for(let i = 0; i < graph.vertices_coords.length; i += 1){
    let j = vertex_map[i];
    if (!speeds[j]) { return; }
    graph.vertices_coords[i][0] = 0.5 + 0.4 *
      Math.cos(t * speeds[j][0] * 0.05 + offsets[j][0]);
    graph.vertices_coords[i][1] = 0.5 + 0.4 *
      Math.sin(t * speeds[j][1] * 0.05 + offsets[j][1]);
  }
  draw();
};

svg.onPress = (e) => {
  resetGraph();
};
