var callback;

svg.size(2.5, 1)
  .padding(0.1)
  .strokeWidth(0.01);

// starting from a blank square,
// make 3 creases from the center to 3 corners.
// the fourth will be calculated using Kawasaki's theorem.
const base = ear.cp.square();
base.segment([0.5, 0.5], [0, 0]);
base.segment([0.5, 0.5], [1, 0]);
base.segment([0.5, 0.5], [1, 1]);

// get the indices of the center vertex and the 3 creases
const vertex = base.nearest(0.5, 0.5).vertex;
const edges3 = base.vertices_edges[vertex];

// using the angles between the 3 existing crease, this
// will generate a fourth crease that satisfies Kawasaki.
const solveKawasaki = (cp) => {
  // to calculate Kawasaki's theorem, we need the 3 edges
  // as vectors, and we need them sorted radially.
  const edges_vectors = ear.graph.make_edges_vector(cp);
  const vectors = edges3.map(i => edges_vectors[i]);
  const sortedVectors = ear.math.counterClockwiseOrder2(vectors)
    .map(i => vectors[i]);
  // this returns solutions for 3 sectors. the large sector is at index 0
  const solution = ear.singleVertex.kawasakiSolutionsVectors(sortedVectors)[0];
  if (!solution) { return; }
  cp.ray(solution, cp.vertices_coords[vertex]);
};

const solveLayerOrder = (cp) => {
  // get the sectors (in radians) around the center vertex.
  const vertices_sectors = ear.graph.make_vertices_sectors(cp);
  const sectors = vertices_sectors[vertex];
  // vertices_sectors and vertices_edges are properly fenceposted.
  // get the crease assignments between the sectors.
  const assignments = cp.vertices_edges[vertex]
    .map(edge => cp.edges_assignment[edge]);
  const solutions = ear.layer.assignment_solver(sectors, assignments);
  if (!solutions.length) { return; }
  // the array of solutions. in this case, contains only one solution.
  // set the one edge's assignment and foldAngle in the crease pattern.
  solutions[0].assignment.forEach((a, i) => {
    cp.edges_assignment[ cp.vertices_edges[vertex][i] ] = a;
  });
  cp.edges_foldAngle = ear.graph.make_edges_foldAngle(cp);
  cp.populate();
  cp.faces_layer = [];
  // what the algorithm thinks is face 0-4 is actually cp.vertices_faces[vertex];
  // i is face 0-4 (needs to be updated)
  solutions[0].layer[0].forEach((layer, i) => {
    cp.faces_layer[cp.vertices_faces[vertex][i]] = layer;
  });
};

const update = (point) => {
  // to prevent confusion, clicking on folded form won't do anything.
  if (point.x > 1) { return; }
  // make sure point is inside the unit square.
  point = ({
    x: Math.max(Math.min(point.x, 1 - 1e-6), 1e-6),
    y: Math.max(Math.min(point.y, 1 - 1e-6), 1e-6),
  })
  const cp = base.copy();
  cp.vertices_coords[vertex] = [point.x, point.y];

  // add the 4th crease
  solveKawasaki(cp);
  // solve layer order
  solveLayerOrder(cp);
  // convert the cp into an origami object, a foldable graph. fold it.
  const folded = ear.origami(cp).flatFolded();

  svg.removeChildren();
  const cpDraw = svg.origami(cp);
  cpDraw.edges.mountain.stroke("black");
  cpDraw.edges.valley.stroke("black").strokeDasharray("0.025 0.015");

  const style = { faces: { front: { fill: "#fb4" }}};
  const foldedDraw = svg.origami(folded, style)
    .translate(1.2, 0);

  if (callback) {
    callback({ sectors });
  }
};

svg.onPress = update;

svg.onMove = (event) => {
  if (event.buttons) {
    update(event.position);
  }
};

update(ear.vector(Math.random(), Math.random())
  .scale(0.2)
  .add([0.4, 0.4]));
