var facePolys, facePolyCopies, layers_face;

svg.size(5.5, 1.2)
  .padding(0.05)
  .strokeWidth(0.005);

// cp and grid
const bottomLayer = svg.g();
const layer = svg.g().translate(2, 0);
const topLayer = svg.g();

// folded faces
const belowBackFaceLayer = svg.g().translate(2.2, 0.6);
const backFaceLayer = svg.g().translate(2.2, 0.6)
  .opacity(0.33);
const frontFaceLayer = svg.g().translate(2.2, 0.1);


const draw_matrix = (matrix) => {
  const group = svg.g();
  const num_faces = matrix.length;
  const rect_w = 1 / num_faces;
  const colorMap = { "-1": "#38c", 1: "#e53", 0: "#fb4" };
  group.rect(1, 1).stroke("black").fill("white");
  Array.from(Array(num_faces))
    .map((_, i) => Array.from(Array(num_faces))
      .map((_, j) => group
        .rect(i/num_faces, j/num_faces, rect_w, rect_w)
        .stroke("none")
        .fill(colorMap[matrix[i][j]] || "white")));
  return group;
};

const update = (cp, matrix, point) => {
  const colorMap = { "-1": "#e53", 1: "#38c", 0: "#fb4" };
  bottomLayer.removeChildren();
  topLayer.removeChildren();
  const near = cp.nearest(point);
  if (near.face === undefined) { return; }
  // highlight faces on cp
  matrix[near.face]
    .map((value, i) => value === undefined
      ? undefined
      : { value, i })
    .filter(a => a !== undefined)
    .map(el => bottomLayer
      .polygon(cp.faces_vertices[el.i]
        .map(v => cp.vertices_coords[v]))
      .fill(colorMap[el.value]));
  bottomLayer
    .polygon(cp.faces_vertices[near.face]
      .map(v => cp.vertices_coords[v]))
    .fill("#fb4");

  // draw layers
  facePolys.forEach(face => face.remove());
  facePolyCopies.forEach(face => face.remove());
  layers_face
    .filter(f => matrix[near.face][f] === 1)
    .map(f => facePolys[f])
    .map(face => face
      .fill("#38c")
      .appendTo(frontFaceLayer));
  layers_face
    .filter(f => matrix[near.face][f] === -1)
    .map(f => facePolys[f])
    .map(face => face
      .fill("#e53")
      .appendTo(backFaceLayer));

  // the selected faces
  facePolys[near.face].remove();
  facePolys[near.face]
    .fill("#fb4")
    .appendTo(frontFaceLayer);
  facePolyCopies[near.face]
    .fill("#fb4")
    .appendTo(belowBackFaceLayer);

  // grid indicator
  const num_faces = cp.faces_vertices.length;
  const w = 1 / num_faces;
  topLayer.rect(-w / 2, near.face / num_faces - (w / 2), 1 + w, w * 2)
    .translate(2, 0)
    .fill("none")
    .stroke("black")
    .strokeWidth(w);
  topLayer.rect(-w / 2, near.face / num_faces - (w / 2), 1 + w, w * 2)
    .translate(2 + 1.2, 0)
    .fill("none")
    .stroke("black")
    .strokeWidth(w);
  topLayer.rect(-w / 2, near.face / num_faces - (w / 2), 1 + w, w * 2)
    .translate(2 + 2.4, 0)
    .fill("none")
    .stroke("black")
    .strokeWidth(w);
};

const load = (FOLD) => {
  layer.removeChildren();

  cp = ear.origami(FOLD);
  const folded = cp.folded().rotateZ(Math.PI * 3 / 4);
  const matrix = ear.layer
    .conditionsToMatrix(ear.layer
      .unsignedToSignedConditions(ear.layer
        .makeConditions(folded)));

  const all_conditions = ear.layer.allLayerConditions(folded);
  layers_face = ear.layer.topologicalOrder(all_conditions[0], cp);

  const faces_layer = ear.graph.invertMap(layers_face);
  const foldedFaces = folded.faces_vertices
    .map(vertices => vertices
      .map(v => folded.vertices_coords[v]));

  // draw crease pattern
  const cpDrawing = svg.origami(cp);
  cpDrawing.faces.fill("none");
  cpDrawing.boundaries.fill("none");
  cpDrawing.edges.mountain.stroke("black");
  cpDrawing.edges.valley.stroke("black").strokeDasharray("0.03 0.015");

  // draw faces ahead of time. append when needed
  facePolys = foldedFaces
    .map(face => ear.svg.polygon(face).stroke("black"));
  facePolyCopies = foldedFaces
    .map(face => ear.svg.polygon(face).stroke("black"));

  draw_matrix(matrix).appendTo(layer);

  const matrix2 = ear.layer
    .conditionsToMatrix(all_conditions.certain);
  draw_matrix(matrix2).translate(1.2,0).appendTo(layer);

  const matrix3 = ear.layer
    .conditionsToMatrix(all_conditions[0]);
  draw_matrix(matrix3).translate(2.4,0).appendTo(layer);

  layer.text("(a)", 0.4, 1.2).fontSize("0.13pt");
  layer.text("(b)", 1.6, 1.2).fontSize("0.13pt");
  layer.text("(c)", 2.8, 1.2).fontSize("0.13pt");

  svg.onMove = (e) => update(cp, matrix3, e);
  update(cp, matrix, [0.45, 0.45]);
};

// kabuto cp
load({"vertices_coords": [[0.5,0],[0.5,0.5],[1,0.5],[0.25,0.25],[0,0.5],[0.5,1],[0.75,0.75],[0.14644660940672669,0],[1,0.8535533905932734],[0.625,0],[1,0.375],[0,0],[1,1],[0.75,0],[1,0.25],[0,0.14644660940672669],[0.8535533905932734,1],[0,1],[1,0]],"edges_vertices": [[0,1],[1,2],[3,4],[0,2],[5,6],[5,4],[3,7],[6,8],[9,10],[1,5],[4,1],[0,3],[11,3],[3,1],[6,2],[1,6],[6,12],[13,14],[3,15],[6,16],[5,17],[17,4],[13,18],[18,14],[11,7],[7,0],[2,8],[8,12],[4,15],[15,11],[0,9],[9,13],[14,10],[10,2],[12,16],[16,5]],"edges_assignment": ["V","V","V","V","V","V","V","V","V","M","M","M","M","M","M","M","M","M","M","M","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B"],"faces_vertices": [[1,0,2],[5,4,1],[4,5,17],[2,0,9,10],[10,9,13,14],[14,13,18],[3,7,0],[8,6,2],[0,1,3],[1,2,6],[4,3,1],[6,5,1],[3,4,15],[5,6,16],[11,3,15],[6,12,16],[7,3,11],[6,8,12]]});
