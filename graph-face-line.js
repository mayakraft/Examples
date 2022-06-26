svg.size(1, 1)
  .padding(0.1)
  .strokeWidth(0.01)
  
const graph = ear.graph.square();
svg.origami(graph);
const g = svg.g();

svg.controls(2)
  .svg(() => svg.circle().radius(0.03).fill("#e53"))
  .position(() => [Math.random(), Math.random()])
  .onChange((p, i, pts) => {
    const line = ear.line.fromPoints(pts);
    const res = ear.graph.intersect_convex_face_line(
      graph, 0, line.vector, line.origin, 0.01
    );

    // draw
    g.removeChildren();
    res.edges
      .map(e => graph.edges_vertices[e.edge]
        .map(v => graph.vertices_coords[v]))
      .forEach(coord => g.line(coord)
        .stroke("#fb4")
        .strokeLinecap("round")
        .strokeWidth(0.03));

    const seg = ear.rect(0, 0, 1, 1).scale(10).clip(line);
    g.line(seg).stroke("black");

    res.vertices
      .map(v => graph.vertices_coords[v])
      .forEach(coord => g.circle(coord)
        .radius(0.03)
        .fill("#fb4")
        .stroke("black"));

  }, true);
