var slider; // HTML slider input

svg.size(-1, -1, 6, 2)
	.padding(0.05)
	.fill("none")
	.stroke("black")
  .strokeWidth(0.033)
  .strokeLinecap("round");
const layer = svg.g();
const solutionsLayer = svg.g().stroke("none");
svg.circle(1);

let controls;
let sliderCount = 5;
let colors = ["#000", "#fff"];

const drawSolutions = (vectors, solutions) => {
	solutionsLayer.removeChildren();

	// binary numbers to find all permutations of valid solutions
	const permuts = Array.from(Array(2 ** solutions.length))
		.map((_, i) => i.toString(2))
		.map(l => Array(solutions.length - l.length + 1).join("0") + l)
		.map(a => a.split("")
			.map((a, i) => a === "1" ? i : undefined)
			.filter(a => a !== undefined))
		.filter(a => a.length % 2 === 1)
		.map(arr => arr.map(i => solutions[i]));

	const circles = permuts
		.map(arr => vectors.concat(arr))
		.map(set => ear.math.counterClockwiseOrder2(set).map(i => set[i]))
		.map((ordered, i) => {
			const g = solutionsLayer.g();
			ordered.map(v => Math.atan2(v[1], v[0]))
				.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
				.map((pair, j) => g.wedge(0, 0, 1, pair[0], pair[1]).fill(colors[j%2]));
			g.circle(1).stroke("black");
			return g;
		});

	circles.forEach((c, i) => c
		.translate(1.333 + (i % 6) * (2/3), -(2/3) + parseInt(i/6) * (2/3))
		.scale(0.3));
};

const onChange = (p, i, points) => {
  layer.removeChildren();

  points.map(p => ear.ray(p))
    .map(ray => ray.normalize())
    .forEach(r => layer.line(r.origin, r.origin.add(r.vector)).stroke("black"));

	const vectors = ear.math.counterClockwiseOrder2(points).map(i => points[i]);
  const solutions = ear.singleVertex.kawasakiSolutionsVectors(vectors)
  	.filter(s => s !== undefined);
  solutions.map(vec => layer.line(0, 0, ...vec).stroke("#e53"));
	
	drawSolutions(vectors, solutions);
};

const rebuildWithCreases = (count) => {
  if (controls) { controls.removeAll(); }
  controls = svg.controls(count)
    .position((_, i) => {
      const randomNudge = Math.random() * Math.PI * 2 / count / 2;
      const angle = Math.PI * 2 / count * i + randomNudge;
      return [Math.cos(angle), Math.sin(angle)];
    })
    .onChange(onChange, true);
  controls.forEach(p => {
    p.updatePosition = (mouse) => [Math.cos, Math.sin]
      .map(f => f(Math.atan2(mouse.y, mouse.x)))
  });
};

rebuildWithCreases(sliderCount);
