svg.size(2.5, 1)
	.padding(0.1)
  .strokeWidth(0.01)
	.overflow("visible");

const graphLayer = svg.g();
const base = ear.cp.square();
// add a vertex in the middle. this vertex will move around.
let vertex = ear.graph.add_vertices(base, [0.5, 0.5]).shift();
// 3 new edges connecting corners to the new vertex
const edges3 = ear.graph.add_edges(base, [[vertex, 0], [vertex, 1], [vertex, 2]]);

// keep the point inside the unit square
const limitPoint = (point) => {
  if (point.x < ear.math.EPSILON) { point.x = ear.math.EPSILON; }
  if (point.y < ear.math.EPSILON) { point.y = ear.math.EPSILON; }
  if (point.x > 1 - ear.math.EPSILON) { point.x = 1 - ear.math.EPSILON; }
  if (point.y > 1 - ear.math.EPSILON) { point.y = 1 - ear.math.EPSILON; }
  return point;
};

const update = (point) => {
  point = limitPoint(point);

  // load the 3 crease CP
  const origami = ear.cp(base);
  origami.vertices_coords[vertex] = [point.x, point.y];
  // this gives us edges_vector, we need it for the kawasaki calculation
  origami.populate();

  // make a junction that contains the three edges' vectors
  // this automatically sorts them counter-clockwise
  // const junction = ear.junction(edges3.map(i => origami.edges_vector[i]));
  // this gives us (possible) solutions for all 3 sectors. the large sector
  // is at index 2, this is the only one we're looking to solve.
	const edges_vectors = edges3.map(i => origami.edges_vector[i]);
	const sortedVectors = ear.math.counter_clockwise_order2(edges_vectors)
		.map(i => edges_vectors[i]);
  // this returns solutions for 3 sectors. the large sector is at index 2
  const solution = ear.single.kawasaki_solutions(sortedVectors)[2];
  if (!solution) { return; }

	origami.ray(solution, origami.vertices_coords[vertex]);
  // fragment rebuilds the graph. need to re-find the vertex at the center
  vertex = ear.graph.nearest_vertex(origami, [point.x, point.y]);

  const sectors = origami.vertices_sectors[vertex];
  const assignments = origami.vertices_edges[vertex]
    .map(edge => origami.edges_assignment[edge]);
  const res = ear.single.layer_solver(sectors, assignments);
  if (!res.length) { return; }

  res[0].assignment.forEach((a, i) => {
    origami.edges_assignment[ origami.vertices_edges[vertex][i] ] = a;
  });
  delete origami.edges_foldAngle;
  origami.edges_foldAngle = ear.graph.make_edges_foldAngle(origami);
  // there will be only one solution, but all we need is one anyway
  origami.populate();
  origami["faces_re:layer"] = [];
  // what the algorithm thinks is face 0-4 is actually origami.vertices_faces[vertex];
  // i is face 0-4 (needs to be updated)
  res[0].layer[0].forEach((layer, i) => {
    origami["faces_re:layer"][origami.vertices_faces[vertex][i]] = layer;
  });
  // copy origami, fold the vertices, translate it to the right a little
  const folded = origami.copy();
  folded.vertices_coords = ear.graph.make_vertices_coords_folded(folded);
  // const center = ear.rect(ear.math.enclosing_rectangle(folded.vertices_coords)).centroid();
  const center = ear.math.average(...folded.vertices_coords);
  ear.graph.translate(folded, 1.75 - center[0], 0.5 - center[1]);

  graphLayer.removeChildren();
  // graphLayer.load(ear.svg(origami, style));
  // graphLayer.load(ear.svg(folded, foldedStyle));
	const flat = graphLayer.graph(origami);
	flat.edges.mountain.stroke("black");
	flat.edges.valley.stroke("black").strokeDasharray("0.025 0.015");
	const foldedDraw = graphLayer.graph(folded);
	foldedDraw.edges.remove();
	foldedDraw.faces.stroke("black");
	foldedDraw.faces.back.forEach(f => f.fill("white"));
	foldedDraw.faces.front.forEach(f => f.fill("#fb4"));
};

let releaseTimeout;

svg.onPress = () => {
  if (releaseTimeout) { clearTimeout(releaseTimeout); }
  svg.stop();
};

svg.onMove = (mouse) => {
  if (mouse.buttons) {
    update(mouse);
  }
};

svg.onRelease = () => {
  if (releaseTimeout) { clearTimeout(releaseTimeout); }
  releaseTimeout = setTimeout(function () {
    svg.play = playFunc;
    startTime = 0;
  }, 2000);
};

let startTime = 1.0 + Math.random()*2;
let step = 0.01;
const duration = 16;
const waitDuration = 0.2;
let runDuration = 8.0;

const drawFrame = (phase) => {
  let scale = 0.45;
  let point = ear.vector(
    Math.sin(phase + (Math.cos(phase / 3) ** 2) - (Math.sin(phase / 4) ** 3)),
    Math.cos(phase + (Math.sin(phase / 4) ** 2) - (Math.cos(phase / 5) ** 3)));
  // convert between -1:1 to between 0:1
  const newCenter = point.scale(scale).add([0.5, 0.5]);
  update(newCenter);
};

let animPhase = Math.random() * 20;
drawFrame(animPhase);

const playFunc = (event) => {
  if (event.time > startTime) {
    let t = (event.time - startTime) / runDuration;
    let inc = (1.0 - Math.cos(t*Math.PI*2))*0.5;
    animPhase += inc * step;
    if (t >= 1) {
      startTime = event.time + Math.random() * waitDuration;  // wait time
      runDuration = 2.0 + Math.random() * duration;
    }
    drawFrame(animPhase);
  }
};

svg.play = playFunc;


