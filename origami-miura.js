var callback;

const graph = {
	vertices_coords: [],
	edges_vertices: [],
	edges_assignment: [],
};
const SIZE = 8;
const wave = 1;

const points = Array.from(Array(SIZE + 1))
	.map(() => Array.from(Array(SIZE + 1)))
	.map((row, y) => row
		.map((point, x) => [
			x / (SIZE - 1) + Math.cos(y) * 0.05 * wave, 
			y / (SIZE - 1) + (x%2) * 0.07
		]));

points.forEach((row, j) => {
	row.forEach((point, i) => {
		// crease zig zag rows
		if (i < row.length-1) {
			const nextHorizPoint = row[ (i+1)%row.length ];
			graph.vertices_coords.push(point, nextHorizPoint);
			graph.edges_vertices.push([graph.vertices_coords.length - 2, graph.vertices_coords.length - 1]);
			graph.edges_assignment.push(j % 2 === 0 ? "M" : "V");
		}
		// crease lines connecting between zig zag rows
		if (j < points.length-1) {
			const nextRow = points[ (j+1)%points.length ];
			const nextVertPoint = nextRow[ i ];
			graph.vertices_coords.push(point, nextVertPoint);
			graph.edges_vertices.push([graph.vertices_coords.length - 2, graph.vertices_coords.length - 1]);
			graph.edges_assignment.push((i + j + 1) % 2 === 0 ? "M" : "V");
		}
	});
});

ear.graph.clean(graph);

ear.graph.getPlanarBoundary(graph).edges.forEach(edge => {
	graph.edges_assignment[edge] = "B";
});

const drawing = svg.origami(graph);
drawing.boundaries.strokeWidth(0.015).strokeLinecap("round");
drawing.edges.mountain.stroke("black");
drawing.edges.valley.stroke("black").strokeDasharray("0.01");

svg.size(1.2, 1.2)
	.padding(0.025)
	.strokeWidth(0.01);
