// +Y axis upwards
svg.size(2.25, 1)
  .padding(0.2)
  .strokeWidth(0.02)
  .scale(1, -1);

const origamiLayer = svg.g()
  .strokeWidth(0.01);
const arrowLayer = svg.g()
  .stroke("black")
  .strokeWidth(0.03);

const foldedStyle = { faces: { front: { fill: "#fb4" }}};
const cpStyle = { edges: { valley: {
  "stroke-width": 0.015,
  "stroke-dasharray": "0.02 0.03",
  "stroke-linecap": "round",
}}};

svg.controls(2)
  .position(() => [Math.random(), Math.random()])
  .onChange((p, i, points) => {
    arrowLayer.removeChildren();
    origamiLayer.removeChildren();
    // to ensure consistency across other systems too
    // get the line's normal from the u-d parameterization
    const line = ear.line.fromPoints(...points);
    const normal = ear.vector(ear.math.vector_origin_to_ud(line).u);
    const midpoint = ear.segment(points).midpoint();

    const origami = ear.origami().flatFold(line);
    origamiLayer.origami(origami, cpStyle);
    origamiLayer.origami(origami.folded(), foldedStyle, false)
      .translate(1.25, 0);

    arrowLayer.arrow(midpoint, midpoint.add(normal.scale(0.2)))
      .head({width: 0.085, height: 0.075, fill: "#e53"})
      .stroke("#e53");
    arrowLayer.arrow(points).stroke("black")
      .head({width: 0.1, height: 0.15});
  }, true);
