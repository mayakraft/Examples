const EPSILON = 0.1;
const colors = ["#fb4", "#158", "#e53"];
const colorCircle = "#ca8";
// make 2 kinds of polygons: inclusive and exclusive
const hull1 = ear.math.convex_hull(Array.from(Array(20))
	.map(() => [Math.random(), Math.random()]));
const hull2 = ear.math.convex_hull(Array.from(Array(20))
	.map(() => [Math.random() + 1.2, Math.random()]));
const polygon1 = ear.polygon(hull1).inclusive();
const polygon2 = ear.polygon(hull2).exclusive();

svg.size(-0.2, -0.2, 2.6, 1.4)
	.strokeWidth(svg.getHeight() / 50)
	.strokeLinecap("round");

const backLines = colors.map(c => svg.line()
  .stroke(c).strokeDasharray("0.0001 0.075"));

// polygon 1 boundary: outset
polygon1.svg().appendTo(svg)
  .fill("none")
  .stroke("#edb")
  .strokeWidth(EPSILON * 2);

polygon1.forEach(p => svg.circle(p).radius(EPSILON)
  .fill(colorCircle));

polygon1.sides
  .map(side => ear.segment(side))
  .map(side => {
    const vec = side.vector.normalize().scale(EPSILON);
    [vec.flip(), vec]
      .map((vec, i) => [side[i], side[i].add(vec)])
      .forEach(ends => svg.line(...ends)
        .stroke("black")
        .strokeDasharray("0.0001 0.035"));
  });

// polygon interior fill
const polygons = [polygon1, polygon2]
  .map(poly => poly.svg().appendTo(svg));

// polygon 2 boundary: inset with mask
const clipPath = svg.clipPath();
clipPath.appendChild(polygon2.svg());
polygon2.svg().appendTo(svg)
  .fill("none")
  .stroke("#edb")
  .strokeWidth(EPSILON*2)
  .clipPath(clipPath);

polygon2.forEach(p => svg.circle(p).radius(EPSILON)
  .fill(colorCircle)
  .clipPath(clipPath));

// black outlines
[polygon1, polygon2].map(poly => poly
  .svg()
  .appendTo(svg)
  .fill("none")
  .stroke("black")
  .strokeWidth(EPSILON/4));

const insides = [polygon1, polygon2].map((poly, i) => {
  polygons[i].fill("white");
});

const layer = svg.g();

svg.controls(6)
  .svg((_, i) => svg.circle(svg.getHeight() / 30)
    .fill(colors[Math.floor(i / 2)]))
  .position(() => [2 * Math.random(), Math.random()])
  .onChange((p, i, points) => {
    layer.removeChildren();
    const lines = [
		  ear.line.fromPoints(points[0], points[1]),
		  ear.ray.fromPoints(points[2], points[3]),
		  ear.segment(points[4], points[5]),
    ];
		// draw the background dotted lines
		const boundary = ear.rect(1, 1).scale(20);
		lines.map(l => boundary.clip(l))
		  .forEach((s, i) => backLines[i].setPoints(s[0], s[1]));
		// draw the clipped lines / rays / segments
		[polygon1, polygon2].forEach((polygon, p) => lines
		  .map((l, i) => ({ seg: polygon.clip(l, EPSILON), i }))
		  .filter(el => el.seg)
		  .forEach(el => {
		    layer.line(el.seg[0], el.seg[1]).stroke(colors[el.i]);
		    if (p === 1) {
		      layer.circle(ear.math.midpoint(el.seg[0], el.seg[1]))
		        .radius(0.03)
		        .stroke(colors[el.i])
		        .fill("white");
		    }
		  }));
	}, true);

