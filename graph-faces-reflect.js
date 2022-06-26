svg.size(0, -0.5, 5, 2)
  .strokeWidth(0.01);

const origami = ear.cp.rectangle(3,1);
origami.line([Math.random()-0.5, 1], [1, 0.5]).valley();
origami.line([Math.random()-0.5, 1], [2, 0.5]).mountain();

// draw crease pattern
svg.origami(origami);

// fold the origami
const folded = origami.flatFolded();

// solve the layer order (it's always the same. [0,2,1])
folded.faces_layer = ear.layer
  .makeFacesLayers(folded)[0];

// draw a folded copy of the origami
svg.origami(folded).translate(3.5, -0.25);
