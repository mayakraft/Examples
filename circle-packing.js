let cirPPad = 6;
svg.size(-cirPPad, -cirPPad, 500 + 2 * cirPPad, 500 + 2 * cirPPad);

const defs = svg.defs();
const clipPath = defs.clipPath();
clipPath.rect(0, 0, 500, 500);

const circleLayer = svg.g();
svg.rect(0, 0, 500, 500)
  .fill("none")
  .strokeWidth(6)
  .stroke("black");
const drawLayer = svg.g();
const circles = Array.from(Array(12)).map(() => ear.circle());
const svgCircles = circles.map(c => circleLayer.circle());

window.circles = circles;

const theAnimatefunc = (event) => {
  // if (svg.mouse.isPressed) {
  //   // circles.forEach(c => c.radius *= 1.002);
  // }
  const result = analyze();
  const mag = result.magnitude;
  const stillCount = result.stillCount;
  const frameDiff = mag - svg.readings[event.frame % 2];
  // if (Math.abs(frameDiff) < .02 && stillCount < 2) {
  if (Math.abs(frameDiff) < .05 && stillCount < 2) {
    svg.frozenCount += 1;
  }
  if (svg.frozenCount > 40) {
    svg.animate = undefined;
  }
  // console.log(svg.frozenCount, frameDiff);
  svg.readings[event.frame % 2] = mag;
  if (mag > -50) {
    circles.forEach((c) => { c.radius *= 1.003; });//1.002);
  } else {
    circles.forEach((c) => { c.radius *= 0.997; });//0.998);
  }
  update();
  // console.log(mag);
  // increment();
};

const boot = function () {
  circles.forEach((c) => {
    c.origin = ear.vector([0,0].map(() => Math.random() * 500))
    c.radius = 6 + Math.random() * 60;
  });

  svgCircles.forEach(c => c.fill("#158").clipPath(clipPath));
  svg.readings = [];
  svg.frozenCount = 0;
  svg.play = theAnimatefunc;
};
boot();

const analyze = function () {
  const matrix = Array.from(Array(12)).map(() => []);
  for (let i = 0; i < 12 - 1; i += 1) {
    for (let j = i + 1; j < 12; j += 1) {
      matrix[i][j] = Math.sqrt(
        ((circles[i].origin[0] - circles[j].origin[0]) ** 2) +
        ((circles[i].origin[1] - circles[j].origin[1]) ** 2)
      ) - (circles[i].radius + circles[j].radius);
    }
  }

  drawLayer.removeChildren();

  const vectors = Array.from(Array(12)).map(() => ear.vector(0, 0));
  const pos_neg = [0, 0];
  let global_negative = 0;
  for (let i = 0; i < 12; i += 1) {
    for (let v = 0; v < 12; v += 1) {
      let vec = [0, 0];
      const d = matrix[v][i] || matrix[i][v];
      if (d != null) {
        if (d < 0) {
          global_negative += d;
        }
        pos_neg[((d < 0) ? 0 : 1)] += 1;
        const amp = (d < 0)
          ? d * 0.001
          : d * 0; //0.000001;
        vec = [
          (circles[i].origin[0] - circles[v].origin[0]),
          (circles[i].origin[1] - circles[v].origin[1])
        ];
        vec[0] *= amp;
        vec[1] *= amp;
      }
      vectors[v][0] += vec[0];
      vectors[v][1] += vec[1];
      vectors[i][0] -= vec[0];
      vectors[i][1] -= vec[1];
    }
  }
  // let moving = vectors.map(a => a[0] !== 0 || a[1] !== 0);
  const stillCount = vectors
    .map(a => a[0] === 0 && a[1] === 0)
    .map(a => (a === true ? 1 : 0))
    .reduce((a, b) => a + b, 0);

  circles.forEach((c, i) => {
    c.origin[0] += vectors[i][0];
    c.origin[1] += vectors[i][1];
  });

  circles.forEach((c, i) => {
    if (c.origin[0] < 0) { c.origin[0] = 0; }
    if (c.origin[1] < 0) { c.origin[1] = 0; }
    if (c.origin[0] > 500) { c.origin[0] = 500; }
    if (c.origin[1] > 500) { c.origin[1] = 500; }
  });


  for (let i = 0; i < 12; i += 1) {
    for (let v = 0; v < 12; v += 1) {
      const d = matrix[v][i] || matrix[i][v];
      if (d != null && d < 5) {
        let opacity = (d - 5) / 5;
        if (opacity < 0) { opacity = 0; }
        let stroke_width = 3 - 3 * Math.pow(((d - 5) / 5), 1);
        if (stroke_width < 0) { stroke_width = 0; }
        drawLayer.line(
          circles[v].origin[0],
          circles[v].origin[1],
          circles[i].origin[0],
          circles[i].origin[1]
        ).stroke("#fb3").strokeWidth(stroke_width).strokeLinecap("round");
      }
    }
  }
  return { magnitude: global_negative, stillCount };
};

svg.onPress = boot;

const increment = function () {
  circles.forEach((c) => { c.radius += 1; });
  update();
};

const decrement = function () {
  circles.forEach((c) => { c.radius -= 1; });
  update();
};

const update = function () {
  circles.forEach((circle, i) => svgCircles[i]
    .center(circle.origin)
    .radius(circle.radius));
};
