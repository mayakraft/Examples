const FOLD = {
	vertices_coords: [[0.5,0],[0.5,0.5],[1,0.5],[0.25,0.25],[0,0.5],[0.5,1],[0.75,0.75],[0.14644660940672669,0],[1,0.8535533905932734],[0.625,0],[1,0.375],[0,0],[1,1],[0.75,0],[1,0.25],[0,0.14644660940672669],[0.8535533905932734,1],[0,1],[1,0]],
	edges_vertices: [[0,1],[1,2],[3,4],[0,2],[5,6],[5,4],[3,7],[6,8],[9,10],[1,5],[4,1],[0,3],[11,3],[3,1],[6,2],[1,6],[6,12],[13,14],[3,15],[6,16],[5,17],[17,4],[13,18],[18,14],[11,7],[7,0],[2,8],[8,12],[4,15],[15,11],[0,9],[9,13],[14,10],[10,2],[12,16],[16,5]],
	edges_assignment: ["V","V","V","V","V","V","V","V","V","M","M","M","M","M","M","M","M","M","M","M","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B"],
	faces_vertices: [[0,1,3],[1,0,2],[1,2,6],[3,4,15],[4,3,1],[2,0,9,10],[5,6,16],[6,5,1],[5,4,1],[4,5,17],[3,7,0],[7,3,11],[6,8,12],[8,6,2],[10,9,13,14],[11,3,15],[6,12,16],[14,13,18]]
};

svg.size(2.5,1.1).padding(0.05);

const bottomLayer = svg.g();
const origamiLayer = svg.g();

const cp = ear.origami(FOLD);
const cpDrawing = origamiLayer.origami(cp);
cpDrawing.faces.fill("none");
cpDrawing.boundaries.fill("none");
cpDrawing.edges.mountain.stroke("#e53");
cpDrawing.edges.valley.stroke("#38c");

const folded = cp.folded(0);
origamiLayer.origami(folded)
  .translate(1.1, 0.25);

origamiLayer.origami(cp.folded(1))
  .translate(1.85, 0.25);

const drawNearestFaces = (near) => {
  if (near.face === undefined) { return; }
  const faces_layer = folded.faces_layer;
  const string = `face ${near.face}, layer ${faces_layer[near.face]}`;
  bottomLayer.text(string, 0.05, 1.1)
    .fontSize("0.07pt")
    .fontFamily("sans-serif")
    .fill("black");
  faces_layer.matrix[near.face]
    .map((value, i) => value === undefined ? undefined : { value, i })
    .filter(a => a !== undefined)
    .map(el => bottomLayer
      .polygon(cp.faces_vertices[el.i]
        .map(v => cp.vertices_coords[v]))
      .fill(el.value === 1 ? "#fb3" : "#f84"));
  bottomLayer
    .polygon(cp.faces_vertices[near.face]
      .map(v => cp.vertices_coords[v]))
    .fill("#38c");
};

svg.onMove = (e) => {
  bottomLayer.removeChildren();

  const near = cp.nearest(e);
  if (near) { drawNearestFaces(near); }
};
