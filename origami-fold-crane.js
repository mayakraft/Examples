svg.size(3.1, 1)
	.padding(0.1)
	.strokeWidth(1 / 100);

fetch("https://robbykraft.github.io/fold/crane.fold")
	.then(res => res.json())
	.then(graph => {
		svg.graph(graph);
		
		graph.vertices_coords = ear.graph.make_vertices_coords_folded(graph, 2);
		// draw origami to the right of the crease pattern
		ear.graph.scale(graph, 1.3);
		ear.graph.translate(graph, 0.8, -0.1);
		svg.graph(graph);
		// svg.load(ear.svg(graph, styleLines));
		ear.graph.translate(graph, 1.1);
		// svg.load(ear.svg(graph, styleFaces));
		const folded = svg.graph(graph);
		folded.edges.remove();
		folded.faces.stroke("none").fill("#0001");
	});

