const { default: Graph } = require('../Components/Graph');
const graph = require('../Pathfinding/Graph');

test('Creating a graph from a 5x5 grid', () => {
    const grid = { fields: [] };
    const widthAndHeight = 5;
    let id = 0;
    for (let i = 0; i < widthAndHeight; i++) {
        let row = [];
        for (let j = 0; j < widthAndHeight; j++) {
            row.push(new Node(id++, 'white'));
        }
        grid.fields.push(row);
    }
    graph.createGraphFromGrid(grid);
    expect(graph.getDigraph().vertices.length).toBe(25);
    expect(graph.getDigraph().edges.length).toBe(25);
});

test('Creating a graph from a graph (visualised graph)', () => {
    const testV = [
        new vertex(0, 173, 232),
        new vertex(1, 195, 410),
        new vertex(2, 373, 378),
        new vertex(3, 402, 253),
        new vertex(4, 490, 235),
        new vertex(5, 644, 236),
        new vertex(6, 657, 334),
        new vertex(7, 629, 426),
        new vertex(8, 482, 488),
        new vertex(9, 318, 525),
        new vertex(10, 267, 379),
        new vertex(11, 284, 261),
        new vertex(12, 416, 108),
    ];
    const testE = [
        new edge(0, 0, 11, '#000000'),
        new edge(1, 11, 12, '#000000'),
        new edge(2, 12, 3, '#000000'),
        new edge(3, 3, 4, '#000000'),
        new edge(4, 4, 2, '#000000'),
        new edge(5, 2, 9, '#000000'),
        new edge(6, 9, 8, '#000000'),
        new edge(7, 8, 7, '#000000'),
        new edge(8, 7, 2, '#000000'),
        new edge(9, 2, 6, '#000000'),
        new edge(10, 6, 5, '#000000'),
        new edge(11, 5, 12, '#000000'),
        new edge(12, 3, 10, '#000000'),
        new edge(13, 10, 11, '#000000'),
        new edge(14, 11, 1, '#000000'),
        new edge(15, 1, 9, '#000000'),
    ];
    const testGraph = { vertices: testV, edges: testE };
    graph.createGraphFromGraph(testGraph);
    expect(graph.getDigraph().vertices.length).toBe(13);
    expect(graph.getDigraph().edges.length).toBe(13);
});

let Node = class {
    constructor(id, bg) {
        this.id = id;
        this.bg = bg;
        this.from = null;
        this.state = 1;
        this.distance = Infinity;
    }
};

let vertex = class {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = { inner: '#97bc62', outer: '#2c5f2d' };
        this.from = null;
    }
};

let edge = class {
    constructor(id, from, to, color) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.length = 1;
        this.color = color;
    }
};
