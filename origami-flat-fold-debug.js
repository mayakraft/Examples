const graph = {"vertices_coords":[[0,0],[1,0],[1,1],[0,1],[0,0.4161070181326432],[0.6262634517350205,0],[0.1192241501818272,0],[0.19161520699294435,0.28879249548277447],[1,0.8950812669825641],[0.7374682638316818,0],[0.6778097784829117,0.653438530401378],[0,0.9201177919700153]],"edges_vertices":[[2,3],[4,0],[0,6],[6,5],[4,7],[7,5],[6,7],[1,8],[8,2],[5,9],[9,1],[7,10],[10,8],[9,10],[3,11],[11,4],[10,11]],"edges_assignment":["B","B","B","B","V","V","M","B","B","B","B","V","V","M","B","B","V"],"edges_foldAngle":[0,0,0,0,180,180,-180,0,0,0,0,180,180,-180,0,0,180],"faces_vertices":[[6,5,7],[7,4,0,6],[9,1,8,10],[10,7,5,9],[11,4,7,10],[10,8,2,3,11]],"faces_re:layer":[2,1,4,3,0,5]};

svg.size(2.25, 1)
  .padding(0.2)
  .strokeWidth(0.01);

const layer = svg.g();
const debugLayer = svg.g();

const style = { faces: { front: { fill: "#fb4" }}};

const flatFold = function (origami, line) {
	debugLayer.removeChildren();
	const result = ear.graph.flat_fold(origami, line.vector, line.origin);
	// get back the folded form
	//const folded = ear.graph(result.folded);
	//folded.frame_classes = ["foldedForm"];
	//debugLayer.origami(result.folded, false);

  debugLayer.line(
  	line.origin[0],
  	line.origin[1],
  	line.origin[0] + line.vector[0],
  	line.origin[1] + line.vector[1])
  	.stroke("#fb4");
	// console.log("result", result);
};

let origami = ear.origami(graph);
// swap out with origami every time we mouse release
let origamiBackup;

// draw crease pattern
layer.origami(origami).translate(1.25, 0);
// draw folded
layer.origami(origami.flatFolded(), style, false);

svg.onPress = () => { origamiBackup = origami.copy(); };
svg.onRelease = () => { origamiBackup = origami.copy(); };

svg.onMove = (mouse) => {
  if (mouse.buttons === 0) { return; }
  const crease = ear.axiom(2, {
    points: [mouse.press, mouse.position]
  }).shift();
  // const crease = ear.axiom(1, {
  //   points: [mouse.press, mouse.position]
  // }).shift();
  // console.log("crease", crease);

  origami = origamiBackup.copy();
  flatFold(origami, crease);
  layer.removeChildren();
  // draw crease pattern
  layer.origami(origami).translate(1.25, 0);
  // draw folded
  const folded = {
  	...origami,
  	vertices_coords: ear.graph
  		.multiply_vertices_faces_matrix2(origami, origami.faces_matrix2)
  };
  folded.frame_classes = ["foldedForm"];
  // console.log("origami.faces_matrix2", origami.faces_matrix2);
  // console.log("here", ear.graph
  // 		.multiply_vertices_faces_matrix2(origami, origami.faces_matrix2));
  // layer.origami(origami.flatFolded(), style, false);
  layer.origami(folded, style, false);
  // console.log("origami.flatFolded()", origami.flatFolded());
};
