const EPSILON = 0.1;

svg.size(-0.2, -0.2, 2.6, 1.4);

const poly1 = ear.polygon
  .convexHull(Array.from(Array(25)).map(() => [Math.random(), Math.random()]));
const poly2 = ear.polygon
  .convexHull(Array.from(Array(25)).map(() => [1.2+Math.random(), Math.random()]));

// polygon 1 boundary: outset
poly1.svg().appendTo(svg)
  .fill("none")
  .stroke("#edb")
  .strokeWidth(EPSILON*2);

// polygon interior fill
const polygons = [poly1, poly2].map(poly => poly.svg().appendTo(svg));

// polygon 2 boundary: inset with mask
const clipPath = svg.clipPath();
clipPath.appendChild(poly2.svg());
poly2.svg().appendTo(svg)
  .fill("none")
  .stroke("#edb")
  .strokeWidth(EPSILON*2)
  .clipPath(clipPath);

// black outlines
[poly1, poly2].map(poly => poly
  .svg()
  .appendTo(svg)
  .fill("none")
  .stroke("black")
  .strokeWidth(EPSILON/4));

const func = [
  ear.math.point_in_convex_poly_inclusive,
  ear.math.point_in_convex_poly_exclusive,
];

svg.controls(1)
  .svg(() => svg.circle().radius(EPSILON / 2))
  .position(() => [1.2, 0.5])
  .onChange((point) => {
    const insides = [poly1, poly2].map((poly, i) => {
      const inside = func[i](point, poly, EPSILON);
      polygons[i].fill(inside ? "#e53" : "#158");
      return inside;
    });
    const any_inside = insides.reduce((a, b) => a.concat(b), []);
    point.svg.fill(any_inside ? "#fb4" : "#e53");
  }, true);
