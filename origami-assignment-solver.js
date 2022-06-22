const LINES = 6;

svg.size(-1, -1, 6, 2)
  .padding(0.05)
  .strokeWidth(0.02)
  .strokeLinecap("round");

svg.circle(1).fill("white").stroke("black");
const corners = Array.from(Array(LINES - 1))
  .map((_, i, arr) => Math.PI * 2 / (arr.length + 1) * i)
  .map(a => a + (Math.random()*2-1)*0.6)
  .map(a => [Math.cos(a), Math.sin(a)]);

const creases = Array.from(Array(LINES))
  .map(() => svg.line().stroke("black"));

const resultsLayer = svg.g()
  .strokeWidth(0.04)
  .translate(1.5, -0.5)
  .scale(0.5, 0.5);

svg.controls(1)
  .position(() => [0, 0])
  .onChange((p) => {
    // creases.forEach((l, i) => l.setPoints(corners[i], p));
    resultsLayer.removeChildren();

    const vectors = corners.map(corner => ear.math.subtract(corner, p));
    // get one kawasaki solution line
    const kawasaki = ear.singleVertex.kawasakiSolutionsVectors(vectors)
      .filter(a => a !== undefined)
      .pop();
    vectors.push(kawasaki);
    const endpoints = corners.concat([kawasaki]);
    // console.log(kawasaki);

    endpoints.forEach((v, i) => creases[i].setPoints(v, p));

    const junction = ear.junction(vectors);
    const results = ear.singleVertex
      .assignmentSolver(junction.sectors, creases.map(() => "U"));

    window.junction = junction;
    window.results = results;

    const order = [];
    junction.order.forEach((n,i) => order[n] = i);

    results.forEach((res, i) => {
      resultsLayer.circle(parseInt(i/2)*2, i%2 * 2, 1)
        .fill("white")
        .stroke("black");
      const lines = endpoints.map(end => resultsLayer.line(
        [end[0] + parseInt(i/2)*2, end[1] + i%2 * 2], 
        [p[0] + parseInt(i/2)*2, p[1] + i%2 * 2])
      );
      res.assignment.forEach((a, j) => a === "M"
        ? lines[order[j]].stroke("#e53").strokeDasharray("")
        : lines[order[j]].stroke("#158").strokeDasharray("0.06 0.08"));
    });
  }, true)
  .forEach(point => point.updatePosition = p => {
    const pt = [p.x, p.y];
    if (pt[0] < -Math.sqrt(2)/2) { pt[0] = -Math.sqrt(2)/2; }
    if (pt[1] < -Math.sqrt(2)/2) { pt[1] = -Math.sqrt(2)/2; }
    if (pt[0] > Math.sqrt(2)/2) { pt[0] = Math.sqrt(2)/2; }
    if (pt[1] > Math.sqrt(2)/2) { pt[1] = Math.sqrt(2)/2; }
    return pt;
  });
