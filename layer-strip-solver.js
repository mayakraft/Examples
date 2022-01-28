var callback;

svg.size(2, 0.5)
  .padding(0.05)
  .strokeWidth(0.02);

const layer_y_scale = -0.06;
const assignment_colors = { M: "#e53", V: "#38c", F: "#aaa" };
const flat_layer = svg.g().translate(0.5, 0.1);
const folded_layer = svg.g().translate(0.3, 0.5)
  .strokeWidth(0.02);

const randomNumbers = length => {
  const lengths = Array.from(Array(length))
    .map(() => Math.random() * 3 + 1);
  const total = lengths.reduce((a, b) => a + b, 0);
  return lengths.map(n => n / total);
};

const randomAssignments = (length) => {
  const string = Array.from(Array(length - 1))
    .map(() => Math.floor(Math.random() * 3))
    .map(i => ("MVF")[i]);
  return ["B"].concat(string, "B");
};

const draw_crease_curve = (x, start_y, end_y, direction, group) => {
  const y = (start_y + end_y) / 2;
  const radius = Math.abs((start_y - end_y) / 2);
  const angles = direction
    ? [Math.PI * 3 / 2, Math.PI / 2]
    : [Math.PI / 2, Math.PI * 3 / 2];
  return group.arc(x, y, radius, ...angles).fill("none");
};

const folded_strip_bounds = (lengths, assignments, faces_layer) => {
  const folded = ear.layer
    .fold_strip_with_assignments(lengths, assignments);
  const points = assignments.map((_, i, arr) => [
    i === arr.length - 1 ? folded[i - 1][1] : folded[i][0],
    i === 0
      ? faces_layer[0] * layer_y_scale
      : faces_layer[i - 1] * layer_y_scale
  ]);
  return ear.math.enclosing_rectangle(points);
};

const draw_folded_strip = (lengths, assignments, faces_layer, group) => {
  const folded = ear.layer
    .fold_strip_with_assignments(lengths, assignments);
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

const draw_flat_strip = (lengths, assignments) => {
  const total_length = lengths.reduce((a, b) => a + b, 0);
  flat_layer.line(0, 0, total_length, 0).stroke("black");
  let pen = 0;
  for (let i = 0; i < assignments.length; i++) {
    flat_layer.circle(pen, 0, 0.02)
      .fill(assignment_colors[assignments[i]]);
    pen += lengths[i];
  }
};

const reset = (num) => {
  // loop to find a good combination of these
  var lengths, assignments, layers = [];
  do {
    lengths = randomNumbers(num);
    assignments = randomAssignments(num);
    layers = ear.layer.single_vertex_solver(lengths, assignments);
  } while(layers.length === 0);
  
  draw_flat_strip(lengths, assignments);
  // use bounds to center the n-number of solutions along the bottom.
  const bounds = layers
    .map(layer => folded_strip_bounds(lengths, assignments, layer));

  let x_off = -bounds[0].x;
  const groups = layers.map((layer, i) => {
    const group = folded_layer.g().translate(x_off - bounds[0].x, 0);
    x_off += bounds[i].width + bounds[i].height;
    // console.log("bounds", bounds);
    draw_folded_strip(lengths, assignments, layer, group);
    return group;
  });
  folded_layer.removeAttribute("transform");
  folded_layer.translate(1 - x_off * 0.5, 0.5);
  if (callback) {
    callback({ lengths, assignments });
  }
};

svg.onPress = () => {
  flat_layer.removeChildren();
  folded_layer.removeChildren();
  reset(6);
};

reset(6);
