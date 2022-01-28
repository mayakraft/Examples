svg.size(2.25, 1)
  .padding(0.2)
  .strokeWidth(0.01);

const style = { faces: { front: { fill: "#fb4" }}};

let origami = ear.origami();

// make an initial crease
const startAngle = Math.random() * 0.5 - 1;
const startCrease = ear.line.fromAngle(startAngle).translate(0.25, 0.25);
origami.flatFold(startCrease);

// every frame of onMove we fold the cache, not
// the folded origami from the previous frame.
let cache = origami.copy();

// draw crease pattern
svg.origami(origami).translate(1.25, 0);
// draw folded
svg.origami(origami.folded(), style);

svg.onPress = () => { cache = origami.copy(); };
svg.onRelease = () => { cache = origami.copy(); };
svg.onMove = (mouse) => {
  if (mouse.buttons === 0) { return; }
  const crease = ear.axiom(2, {points: [mouse.press, mouse.position] }).shift();
  origami = cache.copy();
  origami.flatFold(crease);
  svg.removeChildren();
  // draw crease pattern
  svg.origami(origami).translate(1.25, 0);
  // draw folded
  svg.origami(origami.folded(), style, false);
};
