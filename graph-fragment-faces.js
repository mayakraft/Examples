var slider, countLabel;

const graph = {};
const NUM_EDGES = 20;

svg.size(1, 1).strokeWidth(0.005);
const layer = svg.g().strokeWidth(0.005).stroke("black");
let faces;

const reset = () => {
  Object.keys(graph).forEach(key => delete graph[key]);
  graph.vertices_coords = [];
  graph.edges_vertices = [];

  for (let i = 0; i < NUM_EDGES; i += 1) {
    graph.vertices_coords.push(
      [Math.random(), Math.random()], [Math.random(), Math.random()]
    );
    graph.edges_vertices.push([i * 2, i * 2 + 1]);
  }

  // make into a planar graph
  ear.graph.fragment(graph);

  // build the faces
  ear.graph.populate(graph);

  // draw
  svg.removeChildren();
  const drawing = svg.origami(graph, false);
  drawing.vertices.stroke("#e53").fill("white")
    .childNodes.forEach(vert => vert.setRadius(0.0075));
  drawing.edges.stroke("#e53");

  layer.removeChildren();
  svg.appendChild(layer);

  drawing.faces.childNodes.forEach((face, i, arr) => face.fill(`#fed`));
  faces = drawing.faces.childNodes;
};

reset();

const highlightFace = (index) => {
  if (index < 0) { index = 0; }
  if (index > graph.faces_vertices.length - 1) {
    index = graph.faces_vertices.length - 1;
  }
  layer.removeChildren();
  const clone = faces[index].cloneNode();
  clone.setAttribute("fill", "#e53")
  clone.setAttribute("stroke", "black");
  layer.appendChild(clone);
  if (countLabel) {
    countLabel.innerHTML = `face ${index+1}/${graph.faces_vertices.length}`;
  }
};

if (slider) {
  slider.oninput = (e) => {
    highlightFace(parseInt(e.target.value / 1000 * graph.faces_vertices.length));
  };
}

svg.onPress = reset;
