svg.size(2.5, 1)
  .padding(0.1)
  .strokeWidth(0.01);

const style = {
  edges: {
    mountain: { stroke: "black" },
    valley: { stroke: "black", "stroke-dasharray": "0.025 0.015" }},
  faces: { front: { fill: "white" }, back: { fill: "#fb4"}}
};

// starting from a blank square,
// make 3 creases from the center to 3 corners.
// the fourth will be calculated using Kawasaki's theorem.
const base = ear.cp.square();
base.segment([0.5, 0.5], [0, 0]);
base.segment([0.5, 0.5], [1, 0]);
base.segment([0.5, 0.5], [1, 1]);

// get the indices of the center vertex
const vertex = base.nearest(0.5, 0.5).vertex;

const update = (point) => {
  // to prevent confusion, clicking on folded form won't do anything.
  if (point.x > 1) { return; }
  // make sure point is inside the unit square.
  point = ({
    x: Math.max(Math.min(point.x, 1 - 1e-6), 1e-6),
    y: Math.max(Math.min(point.y, 1 - 1e-6), 1e-6),
  })

  // clone the cp from the base (3 creases)
  // set the center vertex to the point from the touch handler.
  const cp = base.copy();
  cp.vertices_coords[vertex] = [point.x, point.y];

  // using the angles between the 3 existing crease, this
  // will generate a fourth crease that satisfies Kawasaki.
  const solution = ear.vertex.kawasaki_solutions(cp, vertex);
  if (!solution) { return; }
  cp.ray(solution, cp.vertices_coords[vertex]);

  // fold the crease pattern
  const folded = cp.flatFolded();

  // solve layer order
  const faces_layer = ear.layer.make_faces_layers(folded)[3];
  cp.edges_assignment = ear.layer.faces_layer_to_edges_assignments(folded, faces_layer);
  folded.faces_layer = faces_layer;

  // draw things
  svg.removeChildren();
  svg.origami(cp, style);
  svg.origami(folded, style).translate(1.2, 0);
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
