const EPSILON = 0.1;

svg.size(2, 1);
svg.strokeWidth(EPSILON / 8);
const graph = {};
let dots = [];
let circles = [];

const addVertex = (x, y) => {
  ear.graph.add_vertices(graph, [[x, y]], EPSILON);
  svg.removeChildren();
  // graph.vertices_coords
  //   .map(coord => svg.circle(coord)
  //     .radius(EPSILON)
  //     .fill("#edb")
  //     .stroke("none"));
  circles = graph.vertices_coords
    .map(coord => svg.circle(coord)
      .radius(EPSILON)
      .fill("none")
      .stroke("#e53")
      .strokeDasharray(EPSILON / 16 * Math.PI));
  dots = graph.vertices_coords
    .map(coord => svg.circle(coord)
      .radius(EPSILON / 4)
      .fill("black")
      .stroke("none"));
};

svg.onPress = (e) => addVertex(e.x, e.y);
svg.onMove = (e) => {
  if (!graph.vertices_coords) { return; }
  const endpoints_vertex_equivalent = graph.vertices_coords
    .map(coords => ear.math.distance(coords, [e.x, e.y]) < EPSILON)
    .map((on_vertex, i) => on_vertex ? i : undefined)
    .filter(a => a !== undefined);
  dots.forEach(dot => dot.fill("black"));
  endpoints_vertex_equivalent.forEach(i => dots[i].fill("#fb4"));
  circles.forEach(circle => circle.stroke("#e53"));
  endpoints_vertex_equivalent.forEach(i => circles[i].stroke("#fb4"));
};

Array.from(Array(12)).forEach(() => addVertex(
  Math.random() * svg.getWidth(),
  Math.random() * svg.getHeight()
));
