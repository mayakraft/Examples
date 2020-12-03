svg.size(1, 1);
svg.background("#edb", true);

const random = (min = 0, max = 1) => (Math.random() * (max - min)) + min;

var points = Array.from(Array(100))
  .map(() => [random(-1, 2), random(-1, 2)]);

var maskA = svg.mask();
var maskB = svg.mask();

maskA.polygon(points).fill("white").fillRule("evenodd");
maskB.rect(-1, -1, 3, 3).fill("white");
maskB.polygon(points).fill("black").fillRule("evenodd");

var clip = svg.clipPath();
clip.rect(1,1);

svg.circle(random(), random(), 0.5).fill("black").mask(maskA).clipPath(clip);
svg.circle(random(), random(), 0.5).fill("#e53").mask(maskB).clipPath(clip);

