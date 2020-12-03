svg.size(500, 500);
svg.strokeWidth(svg.getWidth() * 0.015);
const drawLayer = svg.g();

const polygon = svg.polygon()
  .stroke("#fb4")
  .fill("none")
  .strokeLinecap("round");

svg.controls(8)
  .position(() => [svg.getWidth(), svg.getHeight()].map(n => n * Math.random()))
  .svg(() => SVG.circle(12).fill("#e53"))
  .onChange((p, i, arr) => {
    drawLayer.removeChildren();
    const hull = ear.math.convex_hull(arr);
    polygon.setPoints(hull);
    // calculate and draw the straight skeleton lines. kawasaki lines are dashed
    ear.math.straight_skeleton(hull)
      .map(s => drawLayer.line(s.points[0], s.points[1])
        .stroke("#158")
        .strokeDasharray(s.type === "skeleton" ? "" : "12 8"));
  }, true);
