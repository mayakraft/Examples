svg.size(1, 1)
  .padding(0.05)
  .strokeWidth(0.015)
  .strokeLinecap("round")
  .stroke('black');

const RADIUS = 0.025;

const clip = svg.clipPath();
clip.rect(1, 1);
const layer = svg.g().clipPath(clip);

svg.rect(1, 1).fill("none");
const boundary = ear.polygon([0,0], [1,0], [1,1], [0,1]);

svg.controls(4)
  .svg(() => svg.circle(RADIUS).fill("#e53").stroke("none"))
  .position((_, i) => i === 0 ? [0.5, 0.5] : [Math.random(), Math.random()])
  .onChange((p, i, points) => {
    layer.removeChildren();

    const l = ear.line.fromPoints(points[2], points[3]);
    const radius = ear.math.distance(points[0], points[1]);
    const circle = ear.circle(points[0], radius);
    const mirrors = circle.intersect(l);
    const sided = ear.math.cross2(l.vector, ear.math.subtract(points[1], l.origin)) > 0;
    
    const colorA = sided ? "#269" : "#fb4";
    const colorB = sided ? "#fb4" : "#269";
    layer.circle(points[0], radius)
      .fill(mirrors ? colorA : "none")
      .stroke(mirrors ? "none" : "#e53");
    boundary.clip(l).svg().appendTo(layer).stroke("#e53");
    if (!mirrors) { return; }
    const pointsVec = ear.math.subtract(points[1], points[0]);
    const pointsRad = Math.atan2(pointsVec[1], pointsVec[0]);
    const mirrorVecs = mirrors.map(p => ear.math.subtract(p, points[0]));
    const mirrorRads = mirrorVecs.map(v => Math.atan2(v[1], v[0]));
    const radians = sided
      ? [mirrorRads[1], pointsRad, mirrorRads[0]]
      : [mirrorRads[0], pointsRad, mirrorRads[1]];
    [0, 1].forEach(i => layer.arc(...points[0], radius, radians[i + 0], radians[i + 1])
      .fill(colorB).stroke("none"));

    const midpoints = mirrors.map(p => ear.math.midpoint(p, points[1]));
    mirrors.forEach(p => layer.line(p, points[1])
      .stroke("white"));
    mirrors.map(p => ear.line.perpendicularBisector(points[1], p))
      .map(l => boundary.clip(l))
      .forEach(seg => seg.svg().appendTo(layer)
        .strokeDasharray("0.04 0.04")
        .strokeWidth(0.02)
        .stroke("black"));
    mirrors.forEach(p => layer.circle(p).radius(RADIUS)
      .fill("#e53").stroke("black"));
    midpoints.forEach(p => layer.circle(p).radius(RADIUS)
      .fill("white").stroke("black"));
  }, true);

