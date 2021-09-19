const diGraph = { vertices: [], edges: [] };

function createGraphFromGrid(grid) {
    diGraph.vertices = [];
    diGraph.edges = [];
    for (let i = 0; i < grid.fields.length; i++) {
        for (let j = 0; j < grid.fields[i].length; j++) {
            diGraph.vertices.push(grid.fields[i][j]);
            diGraph.edges[grid.fields[i][j].id] = findEdges(grid.fields, i, j);
        }
    }
    console.log(diGraph);
}

function createGraphFromGraph(graph) {
    diGraph.vertices = graph.vertices;
    diGraph.edges = new Array(graph.vertices.length).fill(null).map(() => new Array(0).fill(null));
    graph.edges.forEach((edge) => {
        diGraph.edges[edge.from].push(edge.to);
    });
}

function findEdges(grid, i, j) {
    const edgeTo = [];
    if (i < grid.length - 1) edgeTo.push(grid[i + 1][j].id);
    if (j < grid[i].length - 1) edgeTo.push(grid[i][j + 1].id);
    if (i > 0) edgeTo.push(grid[i - 1][j].id);
    if (j > 0) edgeTo.push(grid[i][j - 1].id);
    return edgeTo;
}

function getDigraph() {
    return diGraph;
}

module.exports = {
    createGraphFromGrid,
    createGraphFromGraph,
    getDigraph,
};
