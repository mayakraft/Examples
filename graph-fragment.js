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

const EDGES = 32;

const graph = {};
graph.edges_vertices = Array.from(Array(EDGES))
  .map((_, i) => [i*2, i*2 + 1]);
graph.vertices_coords = Array.from(Array(EDGES * 2))
  .map(() => [Math.cos, Math.sin]
    .map(f => f(Math.PI*2 * Math.random())));

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

svg.size(-1, -1, 7, 2)
  .padding(0.05);
