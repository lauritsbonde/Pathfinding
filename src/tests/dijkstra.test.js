const dijkstra = require('../Pathfinding/dijkstra');
const graph = require('../Pathfinding/Graph');

function gridMaker(w, h, start, end) {
    const grid = { dimensions: { width: w, height: h }, fields: [] };
    let id = 0;
    for (let i = 0; i < h; i++) {
        let row = [];
        for (let j = 0; j < w; j++) {
            const bg = id === start ? 'lightgreen' : id === end ? 'red' : 'white';
            row.push(new Node(id++, bg));
        }
        grid.fields.push(row);
    }
    return grid;
}

let Node = class {
    constructor(id, bg) {
        this.id = id;
        this.bg = bg;
        this.from = null;
        this.state = 1;
        this.distance = Infinity;
    }
};

let type, start, end;

beforeEach(() => {
    type = {};
    type.type = 'grid';
    start = 11;
    end = 89;
    type.grid = gridMaker(10, 10, start, end);
});

test('The setup of grid dijkstra', () => {
    dijkstra.startPath(start, type);
    expect(dijkstra.getPq()[0]).toEqual({ id: 11, distance: 0 });
});
