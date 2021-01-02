const style = {
  edges: false,
  attributes: { faces: {
    front: { fill: "#fff", stroke: "black" },
    back: { fill: "#fb4", stroke: "black" },
  }}
};

let origami = ear.origami();
let origamiBackup; // swap out with origami every time we mouse Release

const startAngle = Math.random() * 0.5 + 2.25;
const startCrease = ear.line.fromAngle(startAngle).translate(0.25, 0.25);
origami.flatFold(startCrease);

svg.load(ear.svg(origami.folded(), style));
svg.size(1, 1).padding(0.1);

svg.onPress = () => { origamiBackup = origami.copy(); };
svg.onRelease = () => { origamiBackup = origami.copy(); };

svg.onMove = (mouse) => {
  if (mouse.buttons === 0) { return; }
  const crease = ear.axiom[2](mouse.press, mouse.position);
	origami = origamiBackup.copy();
	origami.flatFold(crease);
	svg.removeChildren();
  svg.load(ear.svg(origami.folded(), style));
	svg.size(1, 1).padding(0.1);
};

