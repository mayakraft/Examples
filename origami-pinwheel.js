svg.size(2.1, 1).padding(0.05);

const cp = ear.cp();
cp.segment(0.5, 0, 0.5, 1).flat();
cp.segment(0, 0.5, 1, 0.5).flat();
// corner diagonals
cp.segment(0.0, 0.0, 0.25, 0.25).valley();
cp.segment(1.0, 0.0, 0.75, 0.25).valley();
cp.segment(1.0, 1.0, 0.75, 0.75).valley();
cp.segment(0.0, 1.0, 0.25, 0.75).valley();
// center square
cp.rect(0.25, 0.25, 0.5, 0.5).valley();
// edge diagonals
cp.segment(0.5, 0.0, 0.75, 0.25).mountain();
cp.segment(1.0, 0.5, 0.75, 0.75).mountain();
cp.segment(0.5, 1.0, 0.25, 0.75).mountain();
cp.segment(0.0, 0.5, 0.25, 0.25).mountain();
// cp done

// folded form
const face = cp.nearest(0.51, 0.51).face;
const folded = cp.flatFolded(face);
const conditions = ear.layer.all_layer_conditions(folded);
const layers_face = ear.layer.topological_order(conditions[0]);
const faces_layer = ear.graph.invert_map(layers_face);
folded.faces_layer = faces_layer;

const style = {faces:{back:{fill:"#fb4"}}}

svg.origami(cp);
svg.origami(folded, style).translate(1.1, 0);
