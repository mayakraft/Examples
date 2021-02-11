var callback;

svg.size(2.5, 1)
	.padding(0.1)
  .strokeWidth(0.01);

// create a base with 3 creases to 3 corners
// the fourth will be calculated using Kawasaki's theorem
const base = ear.cp.square();
base.segment([0.5, 0.5], [0, 0]);
base.segment([0.5, 0.5], [1, 0]);
base.segment([0.5, 0.5], [1, 1]);

// get the indices of the center vertex and the 3 creases
const vertex = base.nearest(0.5, 0.5).vertex;
const edges3 = base.vertices_edges[vertex];

// keep the point inside the unit square
const limitPoint = (point, ep = ear.math.EPSILON) => {
  if (point.x < ep) { point.x = ep; }
  if (point.y < ep) { point.y = ep; }
  if (point.x > 1 - ep) { point.x = 1 - ep; }
  if (point.y > 1 - ep) { point.y = 1 - ep; }
  return point;
};

const update = (point) => {
  point = limitPoint(point);
	const cp = base.copy();
  cp.vertices_coords[vertex] = [point.x, point.y];
  // this gives us edges_vector, we need it for the kawasaki calculation
  cp.populate();
  // make a junction to sort the edges counter-clockwise
	const edges_vectors = edges3.map(i => cp.edges_vector[i]);
	const sortedVectors = ear.math.counter_clockwise_order2(edges_vectors)
		.map(i => edges_vectors[i]);
  // this returns solutions for 3 sectors. the large sector is at index 0
  const solution = ear.single.kawasaki_solutions(sortedVectors)[0];
  if (!solution) { return; }
  cp.ray(solution, cp.vertices_coords[vertex]);

	// single vertex layer order calculation
	// todo: this should become wrapped up in one big "fold" operation.
  const sectors = cp.vertices_sectors[vertex];
  const assignments = cp.vertices_edges[vertex]
    .map(edge => cp.edges_assignment[edge]);
  const res = ear.single.layer_solver(sectors, assignments);
  if (!res.length) { return; }
  // there will be only one solution, but all we need is one anyway
  res[0].assignment.forEach((a, i) => {
    cp.edges_assignment[ cp.vertices_edges[vertex][i] ] = a;
  });
  cp.edges_foldAngle = ear.graph.make_edges_foldAngle(cp);
  cp.populate();
  cp["faces_re:layer"] = [];
  // what the algorithm thinks is face 0-4 is actually cp.vertices_faces[vertex];
  // i is face 0-4 (needs to be updated)
  res[0].layer[0].forEach((layer, i) => {
    cp["faces_re:layer"][cp.vertices_faces[vertex][i]] = layer;
  });

  // convert the cp into an origami object, a foldable graph. fold it.
	const folded = ear.origami(cp).folded();
  const center = ear.math.average(...folded.vertices_coords);
  ear.graph.translate(folded, 2 - center[0], 0.5 - center[1]);

  svg.removeChildren();
	const cpDraw = svg.graph(cp);
	cpDraw.edges.mountain.stroke("black");
	cpDraw.edges.valley.stroke("black").strokeDasharray("0.025 0.015");

	const style = { faces: { front: { fill: "#fb4" }}};
	const foldedDraw = svg.graph(folded, style);

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

