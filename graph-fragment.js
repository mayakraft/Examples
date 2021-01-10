svg.strokeWidth(1 / 100);

const EDGES = 32;

const graph = {};
graph.edges_vertices = Array.from(Array(EDGES))
  .map((_, i) => [i*2, i*2 + 1]);
graph.vertices_coords = Array.from(Array(EDGES * 2))
  .map(() => [Math.cos, Math.sin]
    .map(f => f(Math.PI*2 * Math.random())));

const one = svg.graph(graph);
one.vertices.fill("white");
one.vertices.stroke("black");
one.vertices.childNodes.forEach(vert => vert.setRadius(0.02));

ear.graph.translate(graph, 2.5, 0);
ear.graph.fragment(graph);

const two = svg.graph(graph);
two.vertices.fill("white");
two.vertices.stroke("black");
two.vertices.childNodes.forEach(vert => vert.setRadius(0.02));

ear.graph.translate(graph, 2.5, 0);
ear.graph.populate(graph);

const three = svg.graph(graph);
three.vertices.fill("white");
three.vertices.stroke("black");
three.vertices.childNodes.forEach(vert => vert.setRadius(0.02));
three.faces
	.childNodes
	.forEach((face, i, arr) => face.fill(`hsl(${i/arr.length*360}, 100%, 50%)`));

svg.size(-1, -1, 7, 2)
  .padding(0.05);

