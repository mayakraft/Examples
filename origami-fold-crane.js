svg.size(3.1, 1)
  .padding(0.1)
  .strokeWidth(1 / 100);

fetch("https://rabbitear.org/fold/crane.fold")
  .then(res => res.json())
  .then(FOLD => {
    // draw crease pattern
    svg.graph(FOLD);

    // draw origami to the right of the crease pattern
    const graph = ear.graph(FOLD);
    graph.scale(1.3);
    graph.translate(0.8, -0.1);
    const vertices_coords = ear.graph
      .make_vertices_coords_folded(graph, 2);
    svg.graph({ ...graph, vertices_coords });
    
    // draw styled folded form. this face # orients upright
    const folded = graph.folded(2);
    folded.translate(1.1);
    svg.graph(folded, { faces: {
      front: { stroke: "none", fill: "#0001" },
      back: { stroke: "none", fill: "#0001" },
    }});
  });

