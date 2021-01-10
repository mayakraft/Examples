svg.stroke("black")
  .strokeWidth(0.03)
  .strokeLinecap("round");

const assignments = ["V", "V", "V", "M", "V", "V", "M", "M"];
const list = [12, 11, 6, 2, 3, 4, 5, 9];
const listsum = list.reduce((a, b) => a + b, 0);
const sectors = list.map(l => l / listsum * Math.PI * 2);
let walk = 0;
const vectors = sectors.map(a => {
  walk += a;
  return [Math.cos(walk), Math.sin(walk)];
});
const rays = vectors.map(v => ear.ray(v, [0, 0]));
const circle = ear.circle(1);
const points = rays.map(ray => circle.intersect(ray).shift());
const graph = {
  vertices_coords: points.concat([[0, 0]]),
  edges_vertices: Array.from(Array(points.length))
    .map((_, i) => [i, (i + 1)%(points.length)])
    .concat(Array.from(Array(points.length))
      .map((_, i) => [i, points.length])),
  edges_assignment: Array.from(Array(points.length))
    .map(() => "B")
    .concat(assignments),
};

ear.graph.populate(graph);
const cpdraw = svg.graph(graph);
cpdraw.edges.mountain.stroke("black");
cpdraw.edges.valley.stroke("black").strokeDasharray(0.04);

const layers = ear.single.sectors_layer(sectors, assignments)
  .shift();

const vertices_coords = ear.graph.make_vertices_coords_folded(graph);
const faces_layer = [];
layers.forEach((l, i) => { faces_layer[l] = i; });
graph["faces_re:layer"] = faces_layer;
const foldedGraph = ear.graph.translate({
  ...graph,
  vertices_coords
}, 2.4, -0.4);

const foldedLayer = svg.g();
const foldedDraw = foldedLayer.graph(foldedGraph);
foldedDraw.vertices.remove();
foldedDraw.edges.remove();
foldedDraw.faces.stroke("black");
foldedDraw.faces.front.forEach(face => face.fill("#fb4"));
foldedDraw.faces.back.forEach(face => face.fill("white"));

svg.strokeWidth(0.015)
svg.size(-1, -1, 4, 2);

svg.onPress = () => foldedLayer
  .querySelector(".faces")
  .childNodes
  .forEach(face => face.opacity(0.333));

svg.onRelease = () => foldedLayer
  .querySelector(".faces")
  .childNodes
  .forEach(face => face.opacity(1.0));

