svg.size(500, 500);

const STROKE_WIDTH = svg.getWidth() * 0.01;
const RADIUS = svg.getWidth() * 0.02;
const svgPolygon = svg.polygon()
  .stroke("#e53")
  .strokeWidth(STROKE_WIDTH)
  .fill("#f8eed9")
  .strokeLinecap("round");

let polygon;
let bisect_edges;

const creaseLayer = svg.g();
const errorLayer = svg.g();

const rebuildCreases = (p, i, points) => {
  const boundary = ear.polygon([[0,0], [500,0], [500,500], [0,500]]);

  polygon = ear.polygon.convexHull(points);
  svgPolygon.setPoints(polygon);
  creaseLayer.removeChildren();
  const poly_point_vectors = polygon.vectors
    .map((vec, i, arr) => [vec, ear.math.flip(arr[(i + arr.length - 1)%arr.length])]);
  const poly_bisects = poly_point_vectors
    .map(vecs => ear.math.clockwise_bisect2(...vecs));
  const poly_rays = polygon.map((p, i) => ear.ray(poly_bisects[i], p));

  const bisect_edges = poly_rays.map(ray => boundary.clip(ray));
  bisect_edges.forEach(seg => creaseLayer.line(seg[0], seg[1]).stroke("#e53").strokeWidth(STROKE_WIDTH));

  const junctions = poly_point_vectors.map((vec, i) => [vec[0], vec[1], poly_bisects[i]])
  const solutions = junctions.map(junction => ear.math.kawasaki_solutions(junction));

  const kawasakiRays = solutions
    .map((three,i) => three.map(vec => ear.ray(vec, polygon[i])))
  const kawasaki_edges = kawasakiRays
    .map(vec => vec.filter((_,i) => i === 1).shift())
    .map(r => boundary.clip(r));
  kawasaki_edges.map(e => creaseLayer.line(e[0], e[1])
    .stroke("#158")
    .strokeWidth(STROKE_WIDTH)
    .strokeDasharray(STROKE_WIDTH*1.5 + " " + STROKE_WIDTH*3)
    .strokeLinecap("round"));

  reportErrors(bisect_edges, kawasaki_edges);
};

const reportErrors = (bisect_edges, kawasaki_edges) =>  {
  errorLayer.removeChildren();
  for (let i = 0; i < bisect_edges.length; i++) {
    for(let j = 0; j < kawasaki_edges.length; j++) {
      if (i !== j) {
        let sect = ear.math.intersect_seg_seg_exclude(
          bisect_edges[i][0], bisect_edges[i][1],
          kawasaki_edges[j][0], kawasaki_edges[j][1]
        );
        // let sect = bisect_edges[i].intersectEdge(kawasaki_edges[j]);
        if (sect !== undefined) {
          errorLayer.circle(sect[0], sect[1], STROKE_WIDTH*2)
            .stroke("none")
            .fill("#e53");
        }
      }
    }
  }
};

const controls = svg.controls(4)
  .svg(() => svg.circle(RADIUS).fill("#e53"))
  .position((_, i) => {
    const angle = Math.PI / 2 * i + Math.random() * Math.PI / 2;
    return [
      svg.getWidth()*0.5 + svg.getWidth()*0.25 * Math.cos(angle), 
      svg.getHeight()*0.5 + svg.getHeight()*0.25 * Math.sin(angle),
    ];
  }).onChange(rebuildCreases, true);
