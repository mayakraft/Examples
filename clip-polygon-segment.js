const EPSILON = 0.2;

svg.size(-1.33, -1.33, 2.66, 2.66);

const strokeWidth = svg.getWidth()*0.015;
const radius = strokeWidth * 1.5;
const polygon = ear.polygon([1,0], [0,1], [-1,0], [0,-1]);

svg.strokeWidth(strokeWidth).strokeLinecap("round");

const svgPolygon = polygon.svg()
  .appendTo(svg)
  .fill("white")
  .stroke("none");

const back = svg.g();

const svgLine = svg.line()
  .stroke("#fb4")
  .strokeDasharray(`${strokeWidth / 100} ${strokeWidth * 2}`);
const svgPolyLines = polygon.sides.map(side => svg.line(side[0], side[1])
  .stroke("black"));

const layer = svg.g();

const svgPolyPoints = polygon.points.map(p => svg.circle(p)
  .radius(radius)
  .fill("white")
  .stroke("black"));

const touchLayer = svg.g();

polygon.sides.map(side => back.line(side[0], side[1])
  .strokeWidth(EPSILON*2)
  .stroke("#e5e5e5"));
polygon.forEach(p => back.circle(p).radius(EPSILON).fill("#ccc"));

svg.controls(2)
  .svg(() => touchLayer.circle().radius(radius).fill("white").strokeWidth(strokeWidth).stroke("black"))
  .position(() => [svg.getWidth(), svg.getHeight()]
    .map(l => l * (Math.random() - 0.5)))
  .onChange((p, i, points) => {
    const segment = ear.segment(...points);
    svgLine.setPoints(points);
    layer.removeChildren();

    // reset colors
    svgPolyPoints.forEach(point => point.stroke("black").fill("white"));
    svgPolyLines.forEach(line => line.stroke("black"));

    // polygon points
    polygon
      .map(p => ear.math.point_on_segment_inclusive(p, ...points, EPSILON))
      .map((onSeg, i) => onSeg ? i : undefined)
      .filter(a => a !== undefined)
      .map(i => svgPolyPoints[i])
      .forEach(point => point.stroke("#e53"));
    polygon
      .map(p => ear.math.point_on_segment_exclusive(p, ...points, EPSILON))
      .map((onSeg, i) => onSeg ? i : undefined)
      .filter(a => a !== undefined)
      .map(i => svgPolyPoints[i])
      .forEach(point => point.fill("#e53"));

    // segment points
    const points_in_exclusive = [segment[0], segment[1]]
      .map(point => ear.math.point_in_convex_poly_exclusive(point, polygon, EPSILON));
    const points_in_inclusive = [segment[0], segment[1]]
      .map(point => ear.math.point_in_convex_poly_inclusive(point, polygon, EPSILON));
    points_in_exclusive.forEach((inside, i) => points[i].svg.fill(inside ? "#e53" : "white"));
    points_in_inclusive.forEach((inside, i) => points[i].svg.stroke(inside ? "#e53" : "black"));

    // sides
    // intersects
    const intersect_exclude = polygon.sides
      .map(side => ear.math.intersect_lines(ear.math.subtract(side[1], side[0]), side[0], segment.vector, segment.origin, ear.math.exclude_s, ear.math.exclude_s, EPSILON));
    const intersect_include = polygon.sides
      .map(side => ear.math.intersect_lines(ear.math.subtract(side[1], side[0]), side[0], segment.vector, segment.origin, ear.math.include_s, ear.math.include_s, EPSILON));
    // collinear
    const collinear_inclusive = polygon.sides
      .map(side => [segment[0], segment[1]]
        .map(p => ear.math.point_on_segment_inclusive(p, side[0], side[1], EPSILON)));
    const collinear_exclusive = polygon.sides
      .map(side => [segment[0], segment[1]]
        .map(p => ear.math.point_on_segment_exclusive(p, side[0], side[1], EPSILON)));

    intersect_include.forEach((sect, i) => {
      if (sect) {
        svgPolyLines[i].stroke("#158");
        layer.circle(sect).radius(radius*1.5).fill("#158");
      }
    });

    intersect_exclude.forEach((sect, i) => {
      if (sect) {
        svgPolyLines[i].stroke("#e53");
        layer.circle(sect).radius(radius).fill("#e53");
      }
    });

    collinear_inclusive.forEach((pair, i) => pair.forEach((onSeg, j) => {
      if (onSeg) {
        layer.line(polygon.sides[i][0], polygon.sides[i][1])
          .stroke("#fb4")
          .strokeWidth(strokeWidth * 1.5)
          .strokeDasharray("0.0001 0.2");
      }
    }));

    collinear_exclusive.forEach((pair, i) => pair.forEach((onSeg, j) => {
      if (onSeg) {
        layer.line(polygon.sides[i][0], polygon.sides[i][1])
          .stroke("#e53")
          .strokeWidth(strokeWidth * 1.5)
          .strokeDasharray("0.0001 0.2")
          .strokeDashoffset("0.1");
      }
    }));

    // polygon.sides
    //   .map(side => ({
    //     overlap: ear.math.overlap_segment_segment_exclusive(...points, ...side, EPSILON),
    //     collinear: ear.math.collinear_segment_segment_exclusive(...points, ...side, EPSILON),
    //   }))
    //   .forEach((el, i) => svgPolyLines[i].stroke(el.overlap ? "#158" : (el.collinear ? "#e53" : "black")));
    const clip = ear.math.clip_segment_in_convex_poly_exclusive(polygon, ...points, EPSILON);
    if (clip) {
      layer.line(...clip).stroke("#fb4");
    }
    const intersections = polygon.intersect(ear.segment(points));
    if (intersections) {
    }
  }, true);



// collinear_line_line_inclusive(aV, aP, bV, bP, epsilon);
// collinear_line_ray_inclusive(aV, aP, bV, bP, epsilon);
// collinear_line_segment_inclusive(aV, aP, b0, b1, epsilon);
// collinear_ray_ray_inclusive(aV, aP, bV, bP, epsilon);
// collinear_ray_segment_inclusive(aV, aP, b0, b1, epsilon);
// collinear_segment_segment_inclusive(a0, a1, b0, b1, epsilon);
// collinear_line_line_exclusive(aV, aP, bV, bP, epsilon);
// collinear_line_ray_exclusive(aV, aP, bV, bP, epsilon);
// collinear_line_segment_exclusive(aV, aP, b0, b1, epsilon);
// collinear_ray_ray_exclusive(aV, aP, bV, bP, epsilon);
// collinear_ray_segment_exclusive(aV, aP, b0, b1, epsilon);
// collinear_segment_segment_exclusive(a0, a1, b0, b1, epsilon);
