svg.size(1, 1)
	.padding(0.1)
	.strokeWidth(1 / 100);

let origami = ear.origami();
let origamiBackup; // swap out with origami every time we mouse Release

const startAngle = Math.random() * 0.5 + 2.25;
const startCrease = ear.line.fromAngle(startAngle).translate(0.25, 0.25);
origami.flatFold(startCrease);

const draw = svg.graph(origami.folded());
draw.faces.stroke("black").fill("white");
draw.edges.remove();
draw.faces.front.forEach(f => f.fill("#fb4"));
draw.faces.back.forEach(f => f.fill("white"));

svg.onPress = () => { origamiBackup = origami.copy(); };
svg.onRelease = () => { origamiBackup = origami.copy(); };

svg.onMove = (mouse) => {
  if (mouse.buttons === 0) { return; }
  const crease = ear.axiom(2, {points: [mouse.press, mouse.position]}).shift();
	origami = origamiBackup.copy();
	origami.flatFold(crease);
	svg.removeChildren();
  // svg.load(ear.svg(origami.folded(), style));
	const drawing = svg.graph(origami.folded());
	drawing.faces.stroke("black").fill("white");
	drawing.edges.remove();
	drawing.faces.front.forEach(f => f.fill("#fb4"));
	drawing.faces.back.forEach(f => f.fill("white"));
};

