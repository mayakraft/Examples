svg.size(-1, -1, 6, 2)
  .strokeWidth(0.015)
  .strokeLinecap("round");
const layer = svg.g();

const style = {
  faces: { back: { fill: "#fb4" }, front: { fill: "white" }},
  edges: {
    mountain: { stroke: "#e53", "stroke-width": 0.02 },
    valley: {
      stroke: "#38c",
      "stroke-width": 0.02,
      "stroke-dasharray": "0.05 0.05"
    }
  }
};

// build the crease pattern. this only runs once at the beginning
const makeGraph = () => {
  // just one arrangement of sectors with a lot of layer solutions
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
    edges_vertices: points.map((_, i, a) => [i, (i+1)%(a.length)])
      .concat(points.map((_, i) => [i, points.length])),
    edges_assignment: points.map(() => "B")
      .concat(points.map(() => "U")),
  });
};

const graph = makeGraph();
const folded = graph.flatFolded();

// draw the unsolved crease pattern
svg.origami(graph, style, false);

// find all layer solutions for the center vertex (8).
const vertices_sectors = ear.graph.makeVerticesSectors(graph);
const solutions = ear.layer.assignmentSolver(vertices_sectors[8]);

// onPress will toggle through solutions
let which = 0;

const drawSolution = (solution) => {
  layer.removeChildren();
  // set the crease pattern's crease assignment & foldAngle
  for (let i = 0; i < solution.assignment.length; i++) {
    graph.edges_assignment[graph.vertices_edges[8][i]] = solution.assignment[i];
  }
  graph.edges_foldAngle = ear.graph.makeEdgesFoldAngle(graph);
  // set the folded origami's layers. each solution has
  // has (potentially) multiple layer orders. get the first.
  folded.faces_layer = solution.layer[0];
  layer.origami(graph, style, false).translate(3.9, 0);
  layer.origami(folded, style, false).translate(2.3, -0.4);
};

drawSolution(solutions[which]);

svg.onPress = () => {
  which = (which + 1) % solutions.length;
  drawSolution(solutions[which]);
};
