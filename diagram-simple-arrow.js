svg.size(2.5, 1)
  .strokeWidth(0.01)
  .padding(0.25);

const style = {
  edges: { valley: {
    "stroke-width": 0.02,
    "stroke-dasharray": "0.05 0.03",
  } },
  faces: {
    front: { fill: "#fb3" },
  }
};

const layer = svg.g();

svg.controls(2)
  .svg(() => svg.circle(0.04).fill("blue"))
  .position(() => [Math.random(), Math.random()])
  .onChange((p, i, pts) => {
    const line = ear.line.fromPoints(...pts);
    const origami = ear.origami().flatFold(line);
    const arrow = ear.diagram.simple_arrow(origami, line);

    layer.removeChildren();
    layer.origami(origami, style);

    layer.arrow(arrow)
      .stroke("black")
      .strokeWidth(0.025);

    const folded = layer.origami(origami.folded(), style)
      .translate(1.5, 0);

    folded.arrow(arrow)
      .stroke("black")
      .strokeWidth(0.025);
  }, true);
