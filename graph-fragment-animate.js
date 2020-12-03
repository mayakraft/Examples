const graph = {};

graph.vertices_coords = Array.from(Array(20)).map(() => []);
graph.edges_vertices = Array.from(Array(graph.vertices_coords.length/2))
  .map((_, i) => [i*2, i*2 + 1]);

const freq = graph.vertices_coords
  .map(() => [Math.random(), Math.random()]);

// var t = 12;
svg.play = (e) => {
  const t = e.time + 10;
  graph.vertices_coords.forEach((vert, i) => {
    graph.vertices_coords[i][0] = Math.cos(t * freq[i][0]);
    graph.vertices_coords[i][1] = Math.sin(t * freq[i][1]);
  })
  svg.clear();
  svg.load( ear.svg(graph, {
    vertices: true,
    attributes: {
      circle: { r: 0.02 },
      vertices: {
        stroke: "black",
        fill: "white"
      }
    }
  }) );
  
  const clone = JSON.parse(JSON.stringify(graph));
  ear.graph.fragment(clone);
  ear.graph.translate(clone, 2.5, 0);
  ear.graph.populate(clone);

  const fragmented = ear.svg(clone, {
    vertices: true,
    attributes: {
      circle: { r: 0.02 },
      vertices: {
        stroke: "black",
        fill: "white"
      }
    }
  });
  const faces = fragmented.querySelector(".faces").childNodes;
  faces.forEach((face, i) => face.fill(`hsl(10, 100%, ${i / faces.length * 50 + 25}%)`));
  svg.load( fragmented );

  svg.size(-1.1, -1.1, 4.7, 2.2);
};

