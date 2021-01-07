svg.size(-1.5, -1.5, 6, 3);

const STROKE_WIDTH = svg.getWidth() * 0.005;
const RADIUS = svg.getWidth() * 0.015;

let polygon;
let bisect_edges;

const cpLayer = svg.g();
const errorLayer = svg.g();

const reportErrors = (bisect_edges, kawasaki_edges) =>  {
	let errors = 0;
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
					errors += 1;
          errorLayer.circle(sect[0], sect[1], STROKE_WIDTH*2)
            .stroke("none")
            .fill("#e53");
        }
      }
    }
  }
	return errors;
};

const rebuildCreases = (p, i, points) => {
  polygon = ear.polygon.convexHull(points);

  const poly_point_vectors = polygon.vectors
    .map((vec, i, arr) => [vec, ear.math.flip(arr[(i + arr.length - 1)%arr.length])]);
  const poly_bisects = poly_point_vectors
    .map(vecs => ear.math.clockwise_bisect2(...vecs));
  const poly_rays = polygon.map((p, i) => ear.ray(poly_bisects[i], p));

  const junctions = poly_point_vectors.map((vec, i) => [vec[0], vec[1], poly_bisects[i]]);
  const solutions = junctions.map(junction => ear.single.kawasaki_solutions(junction));
  const kawasakiRays = solutions
    .map((three,i) => three.map(vec => ear.ray(vec, polygon[i])));

  const cp = ear.cp.octogon();
	const boundary = ear.polygon(cp.vertices_coords);
  cp.polygon(polygon).forEach(e => {
    cp.edges_assignment[e] = "M";
    cp.edges_foldAngle[e] = -180;
  });
  poly_rays.map(ray => cp.ray(ray).forEach(e => {
    cp.edges_assignment[e] = "M";
    cp.edges_foldAngle[e] = -180;
  }));
  kawasakiRays
    .map(vec => vec.filter((_,i) => i === 1).shift())
    .map(r => cp.ray(r).forEach(e => {
      cp.edges_assignment[e] = "V";
      cp.edges_foldAngle[e] = 180;
    }));

	const kawasaki_edges = kawasakiRays
    .map(vec => vec.filter((_,i) => i === 1).shift())
    .map(r => boundary.clipRay(r));
  const bisect_edges = poly_rays.map(ray => boundary.clipRay(ray));

  const errorCount = reportErrors(bisect_edges, kawasaki_edges);

  cpLayer.removeChildren();
  cpLayer.load( ear.svg(cp, {
    attributes: {
      boundaries: {
        stroke: "black",
        "stroke-width": 0.06,
      },
      edges: {
        "stroke-width": 0.03,
        mountain: { stroke: "black" },
        valley: {
          stroke: "black",
          "stroke-linecap": "round",
          "stroke-dasharray": "0.07"
        },
      }
    }
  }));

	if (errorCount) { return; }

	const face = ear.graph.nearest_face(cp, [0, 0]);
	cp.populate();
	cp.vertices_coords = ear.graph.make_vertices_coords_folded(cp, face);
	ear.graph.translate(cp, 3.25);
	
	cpLayer.load( ear.svg(cp, {
		edges: false,
		attributes: {
			faces: {
				front: { fill: "#0003" },
				back: { fill: "#0003" },
			}
  	}
	}));
};

const controls = svg.controls(4)
  .svg(() => svg.circle(RADIUS).fill("#000"))
  .position((_, i) => ear.vector
		.fromAngle(Math.PI / 2 * i + Math.random() * Math.PI / 32)
		.scale(1 / 3))
	.onChange(rebuildCreases, true);

