svg.size(-1, -1, 7, 2);
const cp = ear.cp.circle();

// make 3 random angles, sorted
const angles = [0,1,2]
  .map(() => Math.random() * Math.PI * 2)
  .sort((a, b) => a - b);

// kawasaki solver will give anywhere between 1-3 solutions
// paired with sectors, so we need to filter undefineds.
// get one. any will work. just get the first one.
angles.push(ear.math.kawasaki_solutions_radians(angles)
  .filter(a => a !== undefined)
  .shift());

// crease 4 rays. currently they have no assignment
angles.map(a => ear.vector.fromAngle(a))
  .map(vec => ear.ray(vec))
  .forEach(vec => cp.ray(vec));

// what is the index of the vertex at the center?
const vert = cp.nearest(0, 0).vertex.index;
// get the 4 sector angles
const sectors = cp.vertices_sectors[vert];
// this solves the crease assignment and layer over
const solution = ear.graph.assignment_solver(sectors).shift();

cp.vertices_edges[vert].forEach((e, i) => {
  cp.edges_assignment[e] = solution.assignment[i];
});

const assignments = cp.vertices_edges[vert].map(e => cp.edges_assignment[e]);
const res = ear.graph.single_vertex_fold_angles(sectors, assignments, 0.5);
console.log(res);

svg.load( ear.svg(cp) );

