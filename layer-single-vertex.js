svg.size(-1, -1, 5, 2)
  .padding(0.03)
  .stroke("black")
  .strokeWidth(0.02)
  .strokeLinecap("round");

const layer_y_scale = 0.13;
const assignment_colors = { M: "#e53", V: "#38c", F: "#aaa" };
const circle = svg.circle(1).fill("white");
const layerLayer = svg.g().translate(2, -0.25).strokeWidth(0.04);

const assignments = ["M", "V", "M", "V", "M", "M"];
const junction = [
  [0.54, -0.83],
  [0.83, -0.55],
  [0.99, 0.12],
  [0.42, 0.90],
  [-0.42, 0.90],
  [-0.83, -0.55]
];
const sectors = ear.math.counterClockwiseSectors2(junction);
const lines = junction.map(vec => svg.line(vec))

const draw_crease_curve = (x, start_y, end_y, direction, group) => {
  const y = (start_y + end_y) / 2;
  const radius = Math.abs((start_y - end_y) / 2);
  const angles = direction
    ? [Math.PI * 3 / 2, Math.PI / 2]
    : [Math.PI / 2, Math.PI * 3 / 2];
  return group.arc(x, y, radius, ...angles).fill("none");
};

const draw_folded_vertex = (lengths, assignments, faces_layer, group) => {
  const folded = ear.layer
    .foldStripWithAssignments(lengths, assignments);
  // black face lines
  for (let i = 0; i < folded.length; i++) {
    const layer = faces_layer[i] * layer_y_scale;
    group.line(folded[i][0], layer, folded[i][1], layer)
      .stroke("black");
  }
  // colored assignment lines
  for (let i = 0; i < folded.length; i++) {
    const layer_0 = faces_layer[i] * layer_y_scale;
    const layer_1 = faces_layer[(i+1) % faces_layer.length] * layer_y_scale;
    const direction = folded[i][0] < folded[i][1];
    draw_crease_curve(folded[i][1], layer_0, layer_1, direction, group)
      .stroke(assignment_colors[assignments[(i+1) % assignments.length]]);
  }
  // circles for flat and boundary creases
  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === "F" || assignments[i] === "B") {
      const x = i === assignments.length - 1
        ? folded[i - 1][1]
        : folded[i][0];
      const y = i === 0
        ? faces_layer[0] * layer_y_scale
        : faces_layer[i - 1] * layer_y_scale;
      group.circle(x, y, 0.02)
        .fill(assignment_colors[assignments[i]]);
    }
  }
};

const update = () => {
  layerLayer.removeChildren();

  lines.forEach((line, i) => line
    .stroke(assignments[i] === "M" ? "#e53" : "#158")
    .strokeDasharray(assignments[i] === "M" ? "" : "0.0333 0.0444"));

  const solutions = ear.layer.singleVertexSolver(sectors, assignments, 0.1);

  circle.stroke(solutions.length ? "black" : "#e53");
  circle.fill(solutions.length ? "white" : "#e531");

  solutions
    .forEach(ordering => draw_folded_vertex(sectors, assignments, ordering, layerLayer));
};

update();

svg.onPress = (e) => {
  const nearest = ear.math.smallestComparisonSearch([e.x, e.y], junction, ear.math.distance2);
  assignments[nearest] = assignments[nearest] === "M" ? "V" : "M";
  update();
};
