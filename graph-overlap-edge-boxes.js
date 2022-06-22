svg.size(1, 1)
  .padding(0.05)
  .strokeWidth(0.004);

const backLayer = svg.g();
const cpLayer = svg.g().strokeWidth(0.005);
const frontLayer = svg.g().strokeWidth(0.005);

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

for (let i = 0; i < 40; i++) {
	const seg = cp.segment(
		Math.random() * 2 - 1 + 0.5,
		Math.random() * 2 - 1 + 0.5,
		Math.random() * 2 - 1 + 0.5,
		Math.random() * 2 - 1 + 0.5);
	if (seg) { seg.flat(); }
}

cpLayer.origami(cp, style).strokeWidth(0.002);

const boxes = ear.graph.makeEdgesBoundingBox(cp, 1e-6);
const boxes_svg = boxes.map(box => backLayer
  .rect(box.min[0], box.min[1], box.span[0], box.span[1])
  .fill("#1588")
  .stroke("#158")
  .opacity(0.3));

const draw = (event) => {
  const segment = ear.segment(start, event);
	frontLayer.removeChildren();
	const overlaps = [];
  	boxes_svg.forEach(box => box.fill("#1588").stroke("#158"));
		frontLayer.line(start, event).stroke("#000");
	  const segment_box = ear.math.boundingBox(segment, 1e-6);
    frontLayer
      .rect(
        segment_box.min[0],
        segment_box.min[1],
        segment_box.span[0],
        segment_box.span[1])
      .fill("#fb48")
      .stroke("#fb4")
      .opacity(0.3);
    boxes.forEach((box, i) => {
      const o = ear.math.overlapBoundingBoxes(segment_box, box);
      if (o) {
        boxes_svg[i].fill("#e538").stroke("#e53");
        overlaps.push(i);
      }
    });
	overlaps.forEach(e => {
	  const edge_segment = cp.edges_vertices[e]
	    .map(v => cp.vertices_coords[v]);
	  const edge_vector = ear.math.subtract2(edge_segment[1], edge_segment[0]);
	  const intersect = ear.math.intersectLineLine(
	    edge_vector,
	    edge_segment[0],
	    segment.vector,
	    segment[0],
	    ear.math.include_s,
	    ear.math.include_s);
	  if (intersect) {
	    boxes_svg[e].fill("#fb48").stroke("#fb4");
	    frontLayer.circle(intersect).radius(0.01);
	  }
	});
};

svg.onMove = (event) => {
  if (!event.buttons) { return; }
  draw(event);
};

svg.onPress = (event) => {
  start = event;
};

draw([Math.random(), Math.random()]);
