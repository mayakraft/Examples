svg.size(2, 1)
	.padding(0.05)
	.strokeWidth(0.01);

fetch("https://robbykraft.github.io/fold/crane.fold")
	.then(res => res.json())
	.then(graph => {
		const cp1 = svg.graph(graph);
		cp1.edges.mountain.stroke("#158");
		cp1.edges.valley.stroke("#e53");
		
		ear.graph.translate(graph, 1.1, 0);
		const boundary = ear.graph.get_boundary(graph);
		ear.graph.subgraph(graph, boundary);
		
		const cp2 = svg.graph(graph);
		cp2.vertices.fill("black");
		cp2.vertices.childNodes
			.forEach(vert => vert.setRadius(0.02));
	});

