svg.size(3,1)
  .padding(0.05)
  .strokeWidth(0.01);

const bottomLayer = svg.g();
const cpLayer = svg.g();
const topLayer = svg.g();
const foldedLayer = svg.g().translate(1.75, 0.5);

let cp = ear.cp.rectangle(0.3);
cp.vertices_coords[2] = [0.5, 1];
cp.vertices_coords[3] = [0.2, 1];
cp.line(ear.line.fromPoints([0,0.1], [1,0.1])).valley();
cp.line(ear.line.fromPoints([0,0.15], [1,0.15])).mountain();
cp.line(ear.line.fromPoints([0,0.2], [1,0.2])).mountain();
cp.line(ear.line.fromPoints([0,0.5], [1,0.5])).mountain();
cp.line(ear.line.fromPoints([0,0.7], [1,0.7])).mountain();
cp.line(ear.line.fromPoints([0,0.75], [1,0.75])).mountain();
cp.line(ear.line.fromPoints([0,0.8], [1,0.8])).valley();

const folded = cp.flatFolded(0);
const flipFolded = cp.flatFolded(1);

const conditions = ear.layer.allLayerConditions(folded);
const layers_face = ear.layer.topologicalOrder(conditions[0], cp);
const faces_layer = ear.graph.invertMap(layers_face);
flipFolded.faces_layer = faces_layer;
folded.faces_layer = ear.graph.invertMap(layers_face.slice().reverse());

const drawing = cpLayer.origami(cp);
drawing.faces.fill("none");
drawing.boundaries.fill("none");
drawing.edges.mountain.stroke("#e53");
drawing.edges.valley.stroke("#38c");

cpLayer.origami(folded)
  .scale(2)
  .translate(0.35, 0.3);

cpLayer.origami(flipFolded)
  .scale(2)
  .translate(1,0);

const drawNearest = (near) => {
  if (near.face === undefined) { return; }
  // console.log(near);
  if (near.edge !== undefined) {
    topLayer
      .line(cp.edges_vertices[near.edge]
        .map(v => cp.vertices_coords[v]))
      .strokeWidth(0.02)
      .stroke("black");
  }
  if (near.vertex !== undefined) {
    topLayer.circle(near.vertices_coords)
      .radius(0.03)
      .fill("#e53");
  }
  if (near.face !== undefined) {
    bottomLayer
      .polygon(cp.faces_vertices[near.face]
        .map(v => cp.vertices_coords[v]))
      .opacity(0.666)
      .fill("#158");
    topLayer
      .polygon(folded.faces_vertices[near.face]
        .map(v => folded.vertices_coords[v]))
      .fill("#158")
      .opacity(0.666)
      .translate(0.7,0.6)
      .scale(2);
    topLayer
      .polygon(flipFolded.faces_vertices[near.face]
        .map(v => flipFolded.vertices_coords[v]))
      .fill("#158")
      .opacity(0.666)
      .translate(2,0.0)
      .scale(2);
  }
  if (near.edge !== undefined) {
    topLayer
      .line(folded.edges_vertices[near.edge]
        .map(v => folded.vertices_coords[v]))
      .strokeWidth(0.015)
      .stroke("black")
      .strokeLinecap("round")
      .translate(0.7,0.6)
      .scale(2);
    topLayer
      .line(flipFolded.edges_vertices[near.edge]
        .map(v => flipFolded.vertices_coords[v]))
      .strokeWidth(0.015)
      .stroke("black")
      .strokeLinecap("round")
      .translate(2,0.0)
      .scale(2);
  }
  if (near.vertex !== undefined) {
    topLayer.circle(folded.vertices_coords[near.vertex])
      .radius(0.015)
      .fill("#e53")
      .translate(0.7,0.6)
      .scale(2);
    topLayer.circle(flipFolded.vertices_coords[near.vertex])
      .radius(0.015)
      .fill("#e53")
      .translate(2,0.0)
      .scale(2);
  }
};

svg.onMove = (e) => {
  bottomLayer.removeChildren();
  topLayer.removeChildren();

  const near = cp.nearest(e);
  if (near) { drawNearest(near); }
};
