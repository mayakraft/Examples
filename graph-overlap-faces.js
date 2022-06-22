svg.size(2.2, 1)
	.padding(0.05)
	.strokeWidth(0.004);

const backLayer = svg.g();
const cpLayer = svg.g().strokeWidth(0.005);
const frontLayer = svg.g()
	.stroke("#158")
	.strokeWidth(0.01)
	.strokeLinecap("round");

const style = {
	boundaries: {
		"stroke-width": 0.005,
		fill: "none",
	},
	faces: { fill: "none" },
	edges: { flat: { stroke: "black" } }
};

const cp = ear.cp();
let start = [Math.random(), Math.random()];

for (let i = 0; i < 80; i++) {
	const seg = cp.segment(
		Math.random() * 9 - 4,
		Math.random() * 9 - 4,
		Math.random() * 9 - 4,
		Math.random() * 9 - 4);
	if (seg) { seg.flat(); }
}

cpLayer.origami(cp, style).strokeWidth(0.002);

const boxes = ear.graph.makeEdgesBoundingBox(cp, 1e-6);
const edges_coords = ear.graph.makeEdgesCoords(cp);
const faces = ear.graph.makeFacesPolygon(cp);
const faces_svg = faces
	.map(poly => backLayer.polygon(poly).fill("none"));

const draw = (event) => {
	const segment = ear.segment(start, event);
	frontLayer.removeChildren();
	const overlaps = [];
	faces_svg.forEach(poly => poly.fill("none"));
	frontLayer.line(start, event);
	const segment_box = ear.math.boundingBox(segment, 1e-6);
	const intersections = ear.graph.makeEdgesSegmentIntersection(cp, segment[0], segment[1]);
	const intersected_edges = intersections
		.map((pt, e) => pt === undefined ? undefined : e)
		.filter(a => a !== undefined);
	const faces_map = {};
	intersected_edges
		.forEach(e => cp.edges_faces[e]
			.forEach(f => { faces_map[f] = true; }));
	const intersected_faces = Object.keys(faces_map)
		.map(s => parseInt(s))
		.sort((a, b) => a - b);
	intersected_faces.forEach(f => faces_svg[f].fill("#fb4"));
	
	const copy = cp.copy();
	ear.graph.addPlanarSegment(copy, segment[0], segment[1]);
	const copy_svg = frontLayer.origami(copy).translate(1.2, 0);
	Array.from(copy_svg.faces.children).forEach((face, i, arr) => {
		const hue = ((i / arr.length) * 180 * (2 * (i % 2 + 1))) % 90 + 180;
		face.fill(`hsl(${hue}, 100%, 50%)`);
	});

	// console.log(copy);
};

svg.onMove = (event) => {
	if (!event.buttons) { return; }
	draw(event);
};

svg.onPress = (event) => {
	start = event;
};

draw([Math.random(), Math.random()]);
