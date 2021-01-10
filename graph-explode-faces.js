svg.size(1, 1).padding(0.02)
	.strokeWidth(0.01);

fetch("https://robbykraft.github.io/fold/crane.fold")
	.then(res => res.json())
	.then(graph => {

		const exploded = ear.graph.explode_faces(graph);

		// shrink faces
		exploded.vertices_coords = exploded.faces_vertices.map(face => {
		  const verts = face.map(v => exploded.vertices_coords[v]);
		  const center = ear.math.centroid(verts);
		  return verts.map(v => ear.math.lerp(v, center, 0.5));
		}).reduce((a, b) => a.concat(b), []);
		
		const svgcp = svg.graph(graph);
		svgcp.edges.valley.stroke("#158");
		svgcp.edges.mountain.stroke("#e53");

		ear.graph.svg.faces(exploded)
			.appendTo(svg)
			.fill("#fb4");
	});

