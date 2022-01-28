svg.size(0, 0, 7, 2)
  .padding(0.05)
  .strokeWidth(0.01);

const EDGES = 32;

const graph = {};
graph.edges_vertices = Array.from(Array(EDGES))
  .map((_, i) => [i*2, i*2 + 1]);
graph.vertices_coords = Array.from(Array(EDGES * 2))
  .map(() => [Math.cos, Math.sin]
    .map(f => f(Math.PI*2 * Math.random())));

svg.origami(graph)
  .vertices
  .fill("white")
  .stroke("black")
  .childNodes
  .forEach(vert => vert.setRadius(0.02));

// make into a planar graph
ear.graph.fragment(graph);

svg.origami(graph)
  .translate(2.5, 0)
  .vertices
  .fill("white")
  .stroke("black")
  .childNodes.forEach(vert => vert.setRadius(0.02));

// build faces
ear.graph.populate(graph);

const three = svg.origami(graph);
three.translate(5, 0)
  .vertices.fill("white")
  .stroke("black")
  .childNodes
  .forEach(vert => vert.setRadius(0.02));
three.faces
  .childNodes
  .forEach((face, i, arr) => face.fill(`hsl(${i/arr.length*360}, 100%, 50%)`));

