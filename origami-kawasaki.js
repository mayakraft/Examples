var callback;

const NUM_LINES = 8;
svg.size(-1, -1, 2, 2);
const sectorLayer = svg.g();
const drawLayer = svg.g();

const start_points = Array.from(Array(NUM_LINES))
  .map(() => Math.random() * Math.PI * 2)
  .map(angle => [0.9 * Math.cos(angle), 0.9 * Math.sin(angle)]);

const junctionLines = Array.from(Array(NUM_LINES))
  .map((_, i) => drawLayer.line(0, 0, ...start_points[i])
    .strokeWidth(0.02)
    .stroke("black")
    .strokeLinecap("round"));

const onChange = (p, i, points) => {
  junctionLines[i].setPoints(0, 0, p[0], p[1]);

  const junction = ear.junction(points);
  const kawasakiNormalized = junction
    .alternatingAngleSum()
    .map(n => 0.5 + 0.5 * (Math.PI - n) / (Math.PI) );
  const isFlatFoldable = Math.abs(kawasakiNormalized[0] - kawasakiNormalized[1]) < 0.02;
  const wedgeColors = isFlatFoldable
    ? ["#fb4", "#fb4"]
    : ["#158", "#e53"];
  sectorLayer.removeChildren();
  junction.radians
    .map((_, i, arr) => [arr[i], arr[(i + 1) % arr.length]])
    .map((rads, i) => sectorLayer.wedge(0, 0, Math.sqrt(kawasakiNormalized[i%2]) * 0.9, ...rads)
      .fill(wedgeColors[i%2]));

  if (callback !== undefined) {
    callback({ isFlatFoldable, kawasaki: kawasakiNormalized });
  }
};

const controls = svg.controls(NUM_LINES)
  .position((_, i) => start_points[i])
  .onChange(onChange, true)
  .forEach(p => {
    p.updatePosition = (mouse) => {
      let angle = Math.atan2(mouse.y, mouse.x);
      return [0.9 * Math.cos(angle), 0.9 * Math.sin(angle)];
    }
  });
