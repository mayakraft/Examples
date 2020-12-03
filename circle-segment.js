svg.size(400, 300);

const boundary = ear.rect(svg.getWidth(), svg.getHeight());
const strokeW = svg.getWidth()*0.015;

const radius = Math.min(svg.getWidth() / 3, svg.getHeight() / 3);
const circle = ear.circle(boundary.center, radius);

const bottomLayer = svg.g();
circle.svg()
  .appendTo(svg)
  // .stroke("#fb4")
  .stroke("black")
  .strokeWidth(strokeW)
  .fill("white");
const topLayer = svg.g();

svg.controls(2)
  .svg(() => svg.circle().fill("#e53").radius(strokeW * 3))
  .position(() => [svg.getWidth(), svg.getHeight()].map(n => Math.random()))
  .position((_, i) => [i === 0 ? 0 : svg.getWidth(), svg.getHeight()/2])
  .onChange((p, i, pts) => {
    topLayer.removeChildren();
    bottomLayer.removeChildren();

    const segment = ear.segment(...pts);
    segment
      .svg()
      .appendTo(bottomLayer)
      .stroke("#fb4")
      .strokeWidth(strokeW);

    const intersections = circle.intersect(segment);
    if (intersections === undefined) { return; }
    if (intersections.length === 2) {
      topLayer.line(intersections)
        .stroke("#fb4")
        .strokeWidth(strokeW)
        .strokeDasharray(`${strokeW} ${strokeW * 2}`)
        .strokeLinecap("round");
    }

    intersections.map(i => topLayer.circle(i[0], i[1], strokeW * 2).fill("#158"));
  }, true);
