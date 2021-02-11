var callback;

svg.size(1, 1)
  .padding(0.03)
  .strokeWidth(0.015);

fetch("https://rabbitear.org/fold/crane.fold")
  .then(res => res.json())
  .then(FOLD => {
    const graph = ear.graph(FOLD);
    // draw the graph
    const drawing = svg.graph(graph);
    // style
    drawing.edges.mountain.stroke("#e53");
    drawing.edges.valley.stroke("#158");
    drawing.vertices.fill("none").stroke("none");
    drawing.vertices.childNodes.forEach(v => v.setRadius(0.02));
    const edgeLayer = drawing.insertBefore(ear.svg.g(), drawing.vertices);
    
    svg.onMove = (e) => {
      // reset all styles
      edgeLayer.removeChildren();
      drawing.vertices.childNodes
        .forEach(vertex => vertex.fill("none").stroke("none"));
      drawing.faces.childNodes.forEach(face => face.fill("none"));
      // get the indices of the nearest components
      const nearest = graph.nearest(e.position);
      // indices can be used to grab the svg vertices and faces
      // svg edges are joined paths, we have to draw edge segments
      if (nearest.vertex !== undefined) {
        drawing.vertices.childNodes[nearest.vertex]
          .stroke("#158")
          .fill("#fb4");
      }
      if (nearest.edge !== undefined) {
        const edgeCoords = nearest.edges_vertices
          .map(v => graph.vertices_coords[v]);
        edgeLayer.line(edgeCoords).stroke("#fb4");
      }
      if (nearest.face !== undefined) {
        drawing.faces.childNodes[nearest.face].fill("#fb4");
      }
      if (callback) { callback({ nearest, point: e.position }); }
    };
  });

