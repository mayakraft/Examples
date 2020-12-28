svg.size(-1, -1, 4, 2)
  .padding(0.03)
  .stroke("black")
  .strokeWidth(0.02)
  .strokeLinecap("round");

const circle = svg.circle(1).fill("white");
const layerLayer = svg.g().translate(1.5, -0.1);

const assignments = ["M", "V", "M", "V", "M", "M"];
const junction = ear.junction([
  [0.53,-0.84], [0.83,-0.55], [0.99,0.12], [0.42,0.90], [-0.42,0.90], [-0.83,-0.55]
]);

const lines = junction.vectors.map(vec => svg.line(vec))
const scale = [0.9, 0.07];

const update = () => {
  layerLayer.removeChildren();

  lines.forEach((line, i) => line
    .stroke(assignments[i] === "M" ? "#e53" : "#158")
    .strokeDasharray(assignments[i] === "M" ? "" : "0.0333 0.0444"));

  const solutions = ear.graph.layer_solver(junction.sectors, assignments);

  circle.stroke(solutions.length ? "black" : "#e53");
  circle.fill(solutions.length ? "white" : "#e531");

  solutions.forEach((ordering, iter) => {
    let pos = 0;
    const sector_end = junction.sectors.map((sec, i) => pos += i % 2 ? -sec : sec);
    const points = [];
    ordering.forEach((layer, sector, arr) => {
      points.push([sector_end[(sector + arr.length - 1) % arr.length], layer]);
      points.push([sector_end[sector], layer]);
    });
    const scaled = points.map(p => [p[0] * scale[0], p[1] * scale[1]]);
    layerLayer.polygon(scaled).fill("#0001");
  });
};

update();

svg.onPress = (e) => {
  const nearest = ear.math.smallest_comparison_search([e.x, e.y], junction.vectors, ear.math.distance2);
  assignments[nearest] = assignments[nearest] === "M" ? "V" : "M";
  update();
};
