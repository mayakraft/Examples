const graph = {};
graph.vertices_coords = Array.from(Array(10))
  .map(() => [0, 1].map(() => Math.random()));
graph.edges_vertices = Array.from(Array(12))
  .map(() => [Math.random(), Math.random()]
    .map(n => parseInt(n * graph.vertices_coords.length)));
ear.graph.clean(graph);
const isolated = ear.graph.get_isolated_vertices(graph);
ear.graph.remove(graph, "vertices", isolated);

svg.size(-0.1, -0.1, 1.2, 1.2);
svg.style(`@keyframes dup-vertices-spark-frames {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(7); }
}
.dup-vertices-spark {
  animation: dup-vertices-spark-frames 0.3s ease-out normal forwards;
}
`);
const graphLayer = svg.g();
const animLayer = svg.g();

const draw = () => {
  graphLayer.removeChildren();
  graphLayer.load(ear.svg(graph, {
    vertices: true,
    attributes: {
      circle: { r: 0.02 },
      vertices: {
        stroke: "black",
        "stroke-width": 0.015,
        fill: "white",
      },
      edges: {
        stroke: "black",
        "stroke-width": 0.015,
      }
    }
  }));
};


draw();

let selected;

svg.onPress = (e) => {
  selected = graph.vertices_coords
    .map((coord, i) => ear.math.distance(coord, [e.x, e.y]) < 0.1 ? i : undefined)
    .filter(a => a !== undefined)
    .shift();
};

svg.onMove = (e) => {
  if (selected === undefined) { return; }

  graph.vertices_coords[selected] = [e.x, e.y];
  const result = ear.graph.merge_duplicate_vertices(graph, 0.02);
  if (result.vertices.remove.length) {
    const new_verts = result.vertices.remove.map(i => result.vertices.map[i]);
    // get the first one for animation. this leaves out any others.
    const coord = graph.vertices_coords[new_verts[0]];
    const circle = animLayer.circle(...coord, 0.015)
      .fill("#000");
    circle.setAttribute("class", "dup-vertices-spark");
    circle.setAttribute("transform-origin", `${coord[0]}px ${coord[1]}px`);
    selected = result.vertices.map[selected];
  }
  draw();
};

svg.onRelease = (e) => {
  selected = undefined;
};

// let speeds = graph.vertices_coords.map(() => [0, 1].map(() => Math.random()));
// let offsets = graph.vertices_coords.map(() => [0, 1].map(() => Math.random() * Math.PI * 2));

// const animUpdate = () => {
//   const result = ear.graph.merge_duplicate_vertices(graph, 0.02);
//   if (result.vertices.remove.length) {
//     console.log(result);
//     const new_verts = result.vertices.remove.map(i => result.vertices.map[i]);
//     // get the first one for animation. this leaves out any others.
//     const coord = graph.vertices_coords[new_verts[0]];
//     const circle = animLayer.circle(...coord, 0.015)
//       .fill("#000");
//     circle.setAttribute("class", "dup-vertices-spark");
//     circle.setAttribute("transform-origin", `${coord[0]}px ${coord[1]}px`);
//   }
// };

// let t = 0;

// svg.play = (e) => {
//   t += 1;
//   for(let i = 0; i < graph.vertices_coords.length; i += 1){
//     graph.vertices_coords[i][0] = 0.5+0.4*Math.cos(t*speeds[i][0] * 0.05 + offsets[i][0]);
//     graph.vertices_coords[i][1] = 0.5+0.4*Math.sin(t*speeds[i][1] * 0.05 + offsets[i][1]);
//   }
//   animUpdate();
//   draw();
// };
