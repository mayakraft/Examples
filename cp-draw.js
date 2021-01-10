var callback;

const cpStyle = {
  boundaries: true,
  attributes: {
    boundaries: { stroke: "black" },
    edges: {
      "stroke-linecap": "round",
      mountain: {
        stroke: "#e53",
      },
      valley: {
        stroke: "#158",
        "stroke-dasharray": "0.02",
      },
    }
  }
};

svg.size(1, 1)
  .padding(0.1)
  .strokeWidth(svg.getWidth() / 100);

const cpLayer = svg.g();
const layer = svg.g()
  .fill("none")
  .stroke("black");

const boundary = ear.rect(1, 1);
const shapes = [
  "line",
  "ray",
  "segment",
  "circle",
  // "ellipse",
  "rect",
  // "polygon"
];

let cp = ear.cp();
cp.segment(0.5, 0, 0.5, 1).flat();
cp.segment(0, 0.5, 1, 0.5).flat();
cp.segment(0, 0, 1, 1).flat();
cp.segment(0, 1, 1, 0).flat();
const cpBase = cp.copy();

let shape;
let primitive;
let count = 0;

cpLayer.graph(cp);

svg.onPress = (e) => {
	if (count % 3 === 0) { 
		cp = cpBase.copy();
		cpLayer.removeChildren();
		cpLayer.graph(cp);
		// cpLayer.load(ear.svg(cp, cpStyle));
	}
	count++;
  // cpLayer.load( ear.svg(cp, cpStyle) );
  shape = shapes[Math.floor(Math.random() * shapes.length)];
};

svg.onMove = (e) => {
  if (!e.buttons) { return }
  if (callback) {
    callback({ shape, params: [e.press, e.position]});
  }
  layer.removeChildren();
  primitive = ear[shape].fromPoints(e.press, e.position);
  const drawPrimitive = (shape === "ray" || shape === "line")
    ? boundary.clip(primitive)
    : primitive;
  if (!drawPrimitive) { return; }
  drawPrimitive.svg().appendTo(layer);
};

svg.onRelease = (e) => {
  layer.removeChildren();
  // const cp = ear.cp();
  const res = cp[shape](primitive);
  if (count % 2) { res.mountain(); }
  else { res.valley(); }
	cpLayer.removeChildren();
  // cpLayer.load( ear.svg(cp, cpStyle) );
	cpLayer.graph(cp);
	// console.log(cp);
	if (callback) {
    callback({ cp: cp.copy() });
  }
};

