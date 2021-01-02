const style = {
  edges: false,
  attributes: { faces: {
    front: { fill: "#fff", stroke: "black" },
    back: { fill: "#fb4", stroke: "black" },
  }}
};
const cpStyle = { attributes: { boundaries: { stroke: "black" }}};

svg.size(2.25, 1)
	.padding(0.2)
	.strokeWidth(0.01);

const layer = svg.g();

let origami = ear.origami();
let origamiBackup; // swap out with origami every time we mouse Release

const startAngle = Math.random() * 0.5 + 2.25;
const startCrease = ear.line.fromAngle(startAngle).translate(0.25, 0.25);
origami.flatFold(startCrease);

layer.load(ear.svg(origami.copy().translate(1.25, 0), cpStyle));
layer.load(ear.svg(origami.folded(), style));

svg.onPress = () => { origamiBackup = origami.copy(); };
svg.onRelease = () => { origamiBackup = origami.copy(); };

svg.onMove = (mouse) => {
  if (mouse.buttons === 0) { return; }
  const crease = ear.axiom[2](mouse.press, mouse.position);
	origami = origamiBackup.copy();
	origami.flatFold(crease);
  layer.removeChildren();
  layer.load(ear.svg(origami.copy().translate(1.25, 0), cpStyle));
  layer.load(ear.svg(origami.folded(), style));
};

