svg.size(1, 1)
  .padding(0.01)
  .strokeWidth(svg.getWidth() / 200)
  .stroke('black');

const square = ear.rect(1, 1);

svg.append(square.svg()
  .stroke("black")
  .fill("white"));
const layer = svg.g()
  .stroke("black");

let nextPoints = [];
let nextLines = [];
const points = [...square];
const lines = square.segments()
  .map(seg => ear.segment(seg))
  .map(ear.line);

const isUniquePoint = (point, array) => {
  for (let i = 0; i < array.length; i += 1) {
    if (ear.math.equivalent_vec2(point, array[i])) {
      return false;
    }
  }
  return true;
};

const isUniqueLine = (line, array) => {
  for (let i = 0; i < array.length; i += 1) {
    if (line.isCollinear(array[i])) {
      return false;
    }
  }
  return true;
};

const makeAxiom1 = (limit = -1) => {
  const arr = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const line = ear.axiom(1, { lines: [], points: [points[i], points[j]] });
      if (isUniqueLine(line, lines)
        && isUniqueLine(line, arr)
        && isUniqueLine(line, nextLines)) {
        arr.push(line);
      }
      limit--;
      if (limit === 0) { return arr; }
    }
  }
  return arr;
};
const makeAxiom2 = (limit = -1) => {
  const arr = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const line = ear.axiom(2, { lines: [], points: [points[i], points[j]] });
      if (isUniqueLine(line, lines)
        && isUniqueLine(line, arr)
        && isUniqueLine(line, nextLines)) {
        arr.push(line);
      }
      limit--;
      if (limit === 0) { return arr; }
    }
  }
  return arr;
};
const makeAxiom3 = (limit = -1) => {
  const arr = [];
  for (let i = 0; i < lines.length - 1; i += 1) {
    for (let j = i + 1; j < lines.length; j += 1) {
      const res = ear.axiom(3, { lines: [lines[i], lines[j]], points: [] });
      if (res[0] !== undefined
        && isUniqueLine(res[0], lines)
        && isUniqueLine(res[0], arr)
        && isUniqueLine(res[0], nextLines)) {
        arr.push(res[0]);
      }
      if (res[1] !== undefined
        && isUniqueLine(res[1], lines)
        && isUniqueLine(res[1], arr)
        && isUniqueLine(res[1], nextLines)) {
        arr.push(res[1]);
      }
      limit--;
      if (limit === 0) { return arr; }
    }
  }
  return arr;
};
const makeAxiom4 = (limit = -1) => {
  const arr = [];
  for (let i = 0; i < points.length; i += 1) {
    for (let j = 0; j < lines.length; j += 1) {
      const line = ear.axiom(4, { lines: [lines[j]], points: [points[i]] });
      if (isUniqueLine(line, lines)
        && isUniqueLine(line, arr)
        && isUniqueLine(line, nextLines)) {
        arr.push(line);
      }
      limit--;
      if (limit === 0) { return arr; }
    }
  }
  return arr;
};

const makeAxiom5 = (limit = -1) => {
  const arr = [];
  for (let i = 0; i < points.length; i += 1) {
    for (let j = 0; j < points.length; j += 1) {
      if (i === j) { continue; }
      for (let k = 0; k < lines.length; k += 1) {
        const res = ear.axiom(5, { lines: [lines[k]], points: [points[i], points[j]] });
        if (res[0] !== undefined
          && isUniqueLine(res[0], lines)
          && isUniqueLine(res[0], arr)
          && isUniqueLine(res[0], nextLines)) {
          arr.push(res[0]);
        }
        if (res[1] !== undefined
          && isUniqueLine(res[1], lines)
          && isUniqueLine(res[1], arr)
          && isUniqueLine(res[1], nextLines)) {
          arr.push(res[1]);
        }
        limit--;
        if (limit === 0) { return arr; }
      }
    }
  }
  return arr;
};
const makeAxiom6 = (limit = -1) => {
  const arr = [];
  for (let i = 0; i < lines.length; i += 1) {
    for (let j = 0; j < lines.length; j += 1) {
      if (i === j) { continue; }
      for (let k = 0; k < points.length; k += 1) {
        for (let l = 0; l < points.length; l += 1) {
          if (k === l) { continue; }
          const line = ear.axiom(6, { lines: [lines[i], lines[j]], points: [points[k], points[l]] });
          if (line !== undefined
            && isUniqueLine(line, lines)
            && isUniqueLine(line, arr)
            && isUniqueLine(line, nextLines)) {
            arr.push(line);
          }
          limit--;
          if (limit === 0) { return arr; }
        }
      }
    }
  }
  return arr;
};
const makeAxiom7 = (limit = -1) => {
  const arr = [];
  for (let i = 0; i < lines.length; i += 1) {
    for (let j = 0; j < lines.length; j += 1) {
      if (i === j) { continue; }
      for (let k = 0; k < points.length; k += 1) {
        const line = ear.axiom(7, { lines: [lines[i], lines[j]], points: [points[k]] });
        if (line !== undefined
          && isUniqueLine(line, lines)
          && isUniqueLine(line, arr)
          && isUniqueLine(line, nextLines)) {
          arr.push(line);
        }
        limit--;
        if (limit === 0) { return arr; }
      }
    }
  }
  return arr;
};

for (var rank = 0; rank < 1; rank += 1) {
  nextLines = [];
  nextPoints = [];
  // make new creases
  // nextLines.push(...makeAxiom1(50));
  // nextLines.push(...makeAxiom2(50));
  // nextLines.push(...makeAxiom3(50));
  // nextLines.push(...makeAxiom4(50));
  nextLines.push(...makeAxiom5(50));
  // nextLines.push(...makeAxiom6(50));
  // nextLines.push(...makeAxiom7(50));
  nextLines = nextLines
    .filter(l => square.intersectLine(l) !== undefined);
  console.log("FINISHED", nextLines.length);
  // intersect all creases with each other, get points
  for (let li = 0; li < nextLines.length - 1; li += 1) {
    for (let lj = li + 1; lj < nextLines.length; lj += 1) {
      const point = ear.intersect(nextLines[li], nextLines[lj]);
			if (point === undefined) { continue; }
      if (square.contains(point)
				&& isUniquePoint(point, points)
				&& isUniquePoint(point, nextPoints)) {
        nextPoints.push(point);
      }
    }
  }
  lines.push(...nextLines);
  points.push(...nextPoints);
}


lines.map(line => square.clipLine(line))
  .filter(line => line !== undefined)
  .map(seg => layer.line(seg[0], seg[1]).opacity(0.2));

console.log(nextLines);
console.log(nextPoints);


