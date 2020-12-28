const base = {
  vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1], [0.5, 0.5]],
  edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 3], [4, 0], [4, 1]],
  edges_assignment: ["B", "B", "B", "B", "V", "M", "V"]
};
let midVertex = 4;

const updateCenter = (point) => {
  // keep point in square
  if (point.x < ear.math.EPSILON) { point.x = ear.math.EPSILON; }
  if (point.y < ear.math.EPSILON) { point.y = ear.math.EPSILON; }
  if (point.x > 1 - ear.math.EPSILON) { point.x = 1 - ear.math.EPSILON; }
  if (point.y > 1 - ear.math.EPSILON) { point.y = 1 - ear.math.EPSILON; }

  // reset back to the 3 crease CP
  let origami = JSON.parse(JSON.stringify(base));
  origami.vertices_coords[midVertex] = [point.x, point.y];
  ear.graph.populate(origami);

  const a = { x: 0, y: 0 };
  const b = { x: 1, y: 1 };
  const poke_through = (b.x - a.x)
    * (origami.vertices_coords[midVertex][1] - a.y)
    > (b.y - a.y)
    * (origami.vertices_coords[midVertex][0] - a.x);

  origami.edges_assignment[4] = poke_through ? "V" : "M";

  const k_vectors = ear.math.kawasaki_solutions([4, 5, 6]
    .map(edge => origami.edges_vector[edge]));
  const rays = k_vectors.map(vec => vec === undefined
    ? undefined
    : ear.ray(vec, origami.vertices_coords[midVertex]));

  const boundary = ear.polygon([[0, 0], [1, 0], [1, 1], [0, 1]]);

  const intersects = rays
    .map(ray => ray === undefined
      ? undefined
      : ear.intersect(boundary, ray));

  if (!intersects[2]) { console.log("early exit"); return; }
  const new_vertices = ear.graph.add_vertices_split_edges(origami, intersects[2][0]);
  origami.edges_vertices.push([4, new_vertices[0]]);
  origami.edges_assignment.push(poke_through ? "V" : "M");

  origami = ear.graph.populate({
    vertices_coords: origami.vertices_coords,
    edges_vertices: origami.edges_vertices,
    edges_assignment: origami.edges_assignment,
  });

  svg.clear();
  svg.load( ear.svg(origami, { attributes: {
    faces: {
      back: { fill: "white" },
      front: { fill: "#fb4" },
    },
    edges: {
      mountain: { stroke: "black" },
      valley: { stroke: "black", "stroke-dasharray": "0.025 0.015" },
    }
  }}) );

  const folded = JSON.parse(JSON.stringify(origami));
  folded.vertices_coords = ear.graph.make_vertices_coords_folded(origami, 2);
  const centroid = ear.math.average(...folded.vertices_coords);
  ear.graph.translate(folded, 2 - centroid[0], 0.5 - centroid[1]);
  folded["faces_re:layer"] = poke_through ? [1, 0, 2, 3] : [0, 1, 3, 2];
  svg.load( ear.svg(folded, { edges: false, attributes: {
    faces: {
      back: { fill: "white" },
      front: { fill: "#fb4" },
      stroke: "black"
    }
  } }) );

  svg.strokeWidth(0.01);
  svg.size(-0.1, -0.1, 3, 1.2);
};

svg.onPress = updateCenter;

svg.onMove = (mouse) => {
  if (mouse.buttons) {
    updateCenter(mouse);
  }
};

updateCenter({
  x: 0.4 + Math.random() * 0.2,
  y: 0.4 + Math.random() * 0.2
});
