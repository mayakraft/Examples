svg.size(2.5, 1)
	.padding(0.1)
  .strokeWidth(0.01);

const graphLayer = svg.g();

// CP style
const style = {
  attributes: {
    boundaries: { stroke: "black" },
    faces: {
      back: { fill: "white" },
      front: { fill: "#fb4" },
    },
    edges: {
      mountain: { stroke: "black" },
      valley: { stroke: "black", "stroke-dasharray": "0.025 0.015" },
    }
  }
};

// folded form style. same as CP with small changes
const foldedStyle = JSON.parse(JSON.stringify(style));
foldedStyle.edges = false;
foldedStyle.attributes.faces.stroke = "black";
delete foldedStyle.attributes.boundaries;

// create a base with 3 creases to 3 corners
const base = ear.cp.square();
base.segment([0.5, 0.5], [0, 0]);
base.segment([0.5, 0.5], [1, 0]);
base.segment([0.5, 0.5], [1, 1]);

// get the indices of the center vertex and the 3 creases
const vertex = base.nearest(0.5, 0.5).vertex.index;
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
	const origami = base.copy();
  origami.vertices_coords[vertex] = [point.x, point.y];
  // this gives us edges_vector, we need it for the kawasaki calculation
  origami.populate();
  // make a junction to sort the edges counter-clockwise
  // const junction = ear.junction(edges3.map(i => origami.edges_vector[i]));
	const edges_vectors = edges3.map(i => origami.edges_vector[i]);
	const sortedVectors = ear.math.counter_clockwise_order2(edges_vectors)
		.map(i => edges_vectors[i]);
  // this returns solutions for 3 sectors. the large sector is at index 0
  const solution = ear.single.kawasaki_solutions(sortedVectors)[0];
  if (!solution) { return; }
  origami.ray(solution, origami.vertices_coords[vertex]);

  const sectors = origami.vertices_sectors[vertex];
  const assignments = origami.vertices_edges[vertex]
    .map(edge => origami.edges_assignment[edge]);
  const res = ear.single.layer_solver(sectors, assignments);
  if (!res.length) { return; }
  // there will be only one solution, but all we need is one anyway
  res[0].assignment.forEach((a, i) => {
    origami.edges_assignment[ origami.vertices_edges[vertex][i] ] = a;
  });
  origami.edges_foldAngle = ear.graph.make_edges_foldAngle(origami);
  origami.populate();
  origami["faces_re:layer"] = [];
  // what the algorithm thinks is face 0-4 is actually origami.vertices_faces[vertex];
  // i is face 0-4 (needs to be updated)
  res[0].layer[0].forEach((layer, i) => {
    origami["faces_re:layer"][origami.vertices_faces[vertex][i]] = layer;
  });
  // copy origami, fold the vertices, translate to center it on the right side
	const folded = ear.origami(origami).folded();
  const center = ear.math.average(...folded.vertices_coords);
  ear.graph.translate(folded, 2 - center[0], 0.5 - center[1]);

  graphLayer.removeChildren();
  graphLayer.load(ear.svg(origami, style));
  graphLayer.load(ear.svg(folded, foldedStyle));
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

