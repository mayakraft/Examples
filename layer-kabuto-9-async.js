svg.size(5.15, 1)
  .padding(0.05);

const load = (FOLD) => {
  svg.removeChildren();

  const cp = FOLD;
  const folded = ear.graph(cp).flatFolded();
  
  svg.origami(cp);

  // get all folded states
  ear.layer.make_faces_layers_async(folded)
    .then(faces_layers => faces_layers
      // draw all folded states
      .forEach((faces_layer, i) => {
        const col = 0.8 * (i % 5) + 2;
        const row = 0.3 + 0.5 * Math.floor(i / 5);
        folded.faces_layer = faces_layer;
        svg.origami(folded).translate(col, row).rotate(135);
      }));
};

// kabuto cp
load({"vertices_coords": [[0.5,0],[0.5,0.5],[1,0.5],[0.25,0.25],[0,0.5],[0.5,1],[0.75,0.75],[0.14644660940672669,0],[1,0.8535533905932734],[0.625,0],[1,0.375],[0,0],[1,1],[0.75,0],[1,0.25],[0,0.14644660940672669],[0.8535533905932734,1],[0,1],[1,0]],"edges_vertices": [[0,1],[1,2],[3,4],[0,2],[5,6],[5,4],[3,7],[6,8],[9,10],[1,5],[4,1],[0,3],[11,3],[3,1],[6,2],[1,6],[6,12],[13,14],[3,15],[6,16],[5,17],[17,4],[13,18],[18,14],[11,7],[7,0],[2,8],[8,12],[4,15],[15,11],[0,9],[9,13],[14,10],[10,2],[12,16],[16,5]],"edges_assignment": ["V","V","V","V","V","V","V","V","V","M","M","M","M","M","M","M","M","M","M","M","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B"],"faces_vertices": [[1,0,2],[5,4,1],[4,5,17],[2,0,9,10],[10,9,13,14],[14,13,18],[3,7,0],[8,6,2],[0,1,3],[1,2,6],[4,3,1],[6,5,1],[3,4,15],[5,6,16],[11,3,15],[6,12,16],[7,3,11],[6,8,12]]});
