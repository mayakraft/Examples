const graph = {
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
			const new_vertices = ear.graph.add_vertices(graph, [point, nextHorizPoint]);
			graph.edges_vertices.push(new_vertices);
			graph.edges_assignment.push(j % 2 === 0 ? "M" : "V");
		}
		// crease lines connecting between zig zag rows
		if (j < points.length-1) {
			const nextRow = points[ (j+1)%points.length ];
			const nextVertPoint = nextRow[ i ];
			const new_vertices = ear.graph.add_vertices(graph, [point, nextVertPoint]);
			graph.edges_vertices.push(new_vertices);
			graph.edges_assignment.push((i + j + 1) % 2 === 0 ? "M" : "V");
		}
	})
});

ear.graph.get_planar_boundary(graph).edges.forEach(edge => {
	graph.edges_assignment[edge] = "B";
});

svg.load( ear.svg(graph, { attributes: { edges: {
	boundary: { "stroke-width": 0.015, "stroke-linecap": "round" },
	mountain: { stroke: "black" },
	valley: { stroke: "black", "stroke-dasharray": "0.01" },
}}}) );

const pad = 0.025;
const padding = [-pad, -pad, pad * 2, pad * 2]
svg.size(...svg.getViewBox().map((n, i) => n + padding[i]));
