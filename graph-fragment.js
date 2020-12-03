const style = {
  vertices: true,
  attributes: {
    circle: { r: 0.02 },
    vertices: {
      stroke: "black",
      fill: "white"
    },
    edges: {
      unassigned: { stroke: "black" },
    },
    faces: {
      front: { fill: "none" },
      back: { fill: "none" },
    }
  }
};

const graph = {};

graph.vertices_coords = Array.from(Array(64)).map(() => []);
graph.edges_vertices = Array.from(Array(graph.vertices_coords.length/2))
  .map((_, i) => [i*2, i*2 + 1]);
const freq = graph.vertices_coords
  .map(() => [Math.random(), Math.random()]);
var t = 12;
graph.vertices_coords.forEach((vert, i) => {
  graph.vertices_coords[i][0] = Math.cos(t * freq[i][0]);
  graph.vertices_coords[i][1] = Math.sin(t * freq[i][1]);
});

svg.clear();
svg.load(ear.svg(graph, style));

ear.graph.translate(graph, 2.5, 0);
ear.graph.fragment(graph);

const fragmented = ear.svg(graph, style);
svg.load(fragmented);

ear.graph.translate(graph, 2.5, 0);
ear.graph.populate(graph);

const fragmented2 = ear.svg(graph, style);
fragmented2.querySelector(".faces")
  .childNodes
  .forEach((face, i, arr) => face.fill(`hsl(${i/arr.length*360}, 100%, 50%)`));
svg.load(fragmented2);

svg.size(-1.1, -1.1, 6+1, 2.2);
