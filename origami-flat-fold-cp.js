svg.size(2.25, 1)
  .padding(0.2)
  .strokeWidth(0.01);

let origami = ear.origami();
let origamiBackup; // swap out with origami every time we mouse Release

const startAngle = Math.random() * 0.5 + 2.25;
const startCrease = ear.line.fromAngle(startAngle).translate(0.25, 0.25);
origami.flatFold(startCrease);

// draw crease pattern
svg.graph(origami.copy().translate(1.25, 0));
// draw folded
const style = { faces: { front: { fill: "#fb4" }}};
svg.graph(origami.folded(), style);

svg.onPress = () => { origamiBackup = origami.copy(); };
svg.onRelease = () => { origamiBackup = origami.copy(); };

svg.onMove = (mouse) => {
  if (mouse.buttons === 0) { return; }
  const crease = ear.axiom(2, {points: [mouse.press, mouse.position] }).shift();
  origami = origamiBackup.copy();
  origami.flatFold(crease);
  svg.removeChildren();
  // draw crease pattern
  svg.graph(origami.copy().translate(1.25, 0));
  // draw folded
  svg.graph(origami.folded(), style);
};

