svg.size(1, 0.25)
  .padding(0.05)
  .strokeWidth(0.02);
const folded_layer = svg.g().translate(0.6, 0.2);

const assignment_colors = { M: "#e53", V: "#38c", F: "#aaa" };
const layer_y_scale = -0.06;

const draw_crease_curve = (x, start_y, end_y, direction, group) => {
  const y = (start_y + end_y) / 2;
  const radius = Math.abs((start_y - end_y) / 2);
  const angles = direction
    ? [Math.PI * 3 / 2, Math.PI / 2]
    : [Math.PI / 2, Math.PI * 3 / 2];
  return group.arc(x, y, radius, ...angles).fill("none");
};

const draw_folded_strip = (lengths, assignments, faces_layer, group) => {
  const folded = ear.layer
    .foldStripWithAssignments(lengths, assignments);
  // black face lines
  for (let i = 0; i < folded.length; i++) {
    const layer = faces_layer[i] * layer_y_scale;
    group.line(folded[i][0], layer, folded[i][1], layer)
      .stroke("black");
  }
  // colored assignment lines
  for (let i = 0; i < folded.length - 1; i++) {
    const layer_0 = faces_layer[i] * layer_y_scale;
    const layer_1 = faces_layer[i+1] * layer_y_scale;
    const direction = folded[i][0] < folded[i][1];
    draw_crease_curve(folded[i][1], layer_0, layer_1, direction, group)
      .stroke(assignment_colors[assignments[i+1]]);
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

const lengths = [0.121,0.294,0.173,0.116,0.206,0.086];
const assignments = ["B","M","F","M","F","V","B"];
const layers = [3, 1, 1, 0, 0, 2];

draw_folded_strip(lengths, assignments, layers, folded_layer);

svg.circle(0.635, 0.14, 0.04)
  .fill("none")
  .stroke("#fb4")
  .strokeWidth(0.03)
  .strokeDasharray("0.015 0.021");
