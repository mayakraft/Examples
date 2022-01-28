svg.size(-1, -1, 6, 2)
  .strokeWidth(0.015)
  .strokeLinecap("round");
const layer = svg.g();

const makeGraph = () => {
  const list = [12, 11, 6, 2, 3, 4, 5, 9];
  const listsum = list.reduce((a, b) => a + b, 0);
  let walk = 0;
  const points = list
    .map(l => l / listsum * Math.PI * 2)
    .map(a => walk += a)
    .map(angle => [Math.cos(angle), Math.sin(angle)])
    .map(v => ear.ray(v, [0, 0]))
    .map(ray => ear.circle(1).intersect(ray).shift());
  return ear.graph({
    vertices_coords: points.concat([[0, 0]]),
    edges_vertices: Array.from(Array(points.length))
      .map((_, i) => [i, (i + 1)%(points.length)])
      .concat(Array.from(Array(points.length))
        .map((_, i) => [i, points.length])),
    edges_assignment: Array.from(Array(points.length))
      .map(() => "B")
      .concat(Array.from(Array(points.length)).map(() => "U")),
  });
};

const graph = makeGraph();
// console.log(graph);

svg.origami(graph, false);
const folded = graph.flatFolded();

// find a solution, set the edges and face layers
const vertices_sectors = ear.graph.make_vertices_sectors(graph);
// console.log("vertices_sectors", vertices_sectors);
const solutions = ear.layer.assignment_solver(vertices_sectors[8]);
let counter = 0;

const res = ear.layer.make_faces_layers(folded);
console.log("solutions", solutions);
console.log("res", res);

const drawSolution = (solution) => {
  layer.removeChildren();
  for (let i = 0; i < solution.assignment.length; i++) {
    graph.edges_assignment[i + solution.assignment.length] = solution.assignment[i];
  }
  layer.origami(graph, {
    edges: {
      mountain: { "stroke-width": 0.02, stroke: "#e53" },
      valley: {
        "stroke-width": 0.02,
        stroke: "#38c",
        "stroke-dasharray": "0.05 0.05"
      }
    }
  }, false).translate(3.9, 0);
  delete graph.edges_foldAngle;
  ear.graph.populate(graph);
  const vertices_coords = ear.graph.make_vertices_coords_flat_folded(graph);
  const folded = { ...graph, vertices_coords };
  folded.faces_layer = solution.layer[0];//ear.graph.invert_map(layers);
  const foldedDraw = layer.origami(folded, false)
    .stroke("black")
    .translate(2.3, -0.4);
  foldedDraw.vertices.remove();
  foldedDraw.edges.remove();
  foldedDraw.faces.front.forEach(face => face.fill("#fb4"));
  foldedDraw.faces.back.forEach(face => face.fill("white"));
};

drawSolution(solutions[counter]);

svg.onPress = () => {
  counter = (counter + 1) % solutions.length;
  drawSolution(solutions[counter]);
};
