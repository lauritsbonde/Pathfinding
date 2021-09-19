const pq = require('./pq');

const graph = require('./Graph');

function startPath(start, type) {
    console.log(type);
    if (type.type === 'grid') {
        graph.createGraphFromGrid(type.grid);
    } else if (type.type === 'graph') {
        graph.createGraphFromGraph(type.graph);
    }

    pq.reset();
    pq.insert(start, 0);

    graph.getDigraph().vertices[start].from = -1;
    graph.getDigraph().vertices[start].distance = 0;
}

function step(end, start, graphType) {
    const next = pq.dequeue();
    graph.getDigraph().vertices[next.id].state = 3;
    if (next.id === end) {
        pq.reset();
        return { msg: 'done', path: found(next.id, start) };
    }
    graph.getDigraph().edges[next.id].forEach((neighbour) => {
        // states 1: 'clear', 2: 'in pq', 3: 'dequed/wall(maybe make wall another state)'
        if (graph.getDigraph().vertices[neighbour].state === 3) {
            return;
        } else if (graph.getDigraph().vertices[neighbour].state === 2) {
            //should the manhatten distance not be from the start
            let distance;
            if (graphType.type === 'grid') {
                distance = manhattanDistance(start, neighbour, graphType.grid.dimensions) + calcHeuristic(neighbour, end, graphType.grid.dimensions);
            } else if (graphType.type === 'graph') {
                //TODO: get the actial distance of the edge;
                distance = 1;
            }
            if (distance < graph.getDigraph().vertices[neighbour].distance) {
                pq.insert(neighbour, distance);
                graph.getDigraph().vertices[neighbour].from = next.id;
                graph.getDigraph().vertices[neighbour].distance = distance;
                graph.getDigraph().vertices[neighbour].state = 2;
            }
        } else {
            let distance;
            if (graphType.type === 'grid') {
                distance = manhattanDistance(start, neighbour, graphType.grid.dimensions) + calcHeuristic(neighbour, end, graphType.grid.dimensions);
            } else if (graphType.type === 'graph') {
                //TODO: get the actial distance of the edge;
                distance = 1;
            }
            pq.insert(neighbour, distance);
            graph.getDigraph().vertices[neighbour].from = next.id;
            graph.getDigraph().vertices[neighbour].distance = distance;
            graph.getDigraph().vertices[neighbour].state = 2;
        }
    });
    return { msg: 'running', field: { from: graph.getDigraph().vertices[next.id].from, to: next.id } };
}

function findNeighbours(start, current, dimensions) {}

function toCoord(point, dimensions) {
    const row = Math.floor(point / dimensions.height);
    const col = point % dimensions.width;
    return [row, col];
}

function manhattanDistance(first, second, dimensions) {
    const p1 = toCoord(first, dimensions);
    const p2 = toCoord(second, dimensions);
    return Math.abs(p2[0] - p1[0]) + Math.abs(p2[1] - p1[1]);
}

function calcHeuristic(first, second, dimensions) {
    const p1 = toCoord(first, dimensions);
    const p2 = toCoord(second, dimensions);
    const base = Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[0] - p1[0], 2);
    return Math.sqrt(base);
}

function found(id, start) {
    const path = [];
    let next = id;
    while (graph.getDigraph().vertices[next].from !== start) {
        const cell = graph.getDigraph().vertices[next].from;
        path.push(cell);
        next = cell;
    }
    return path;
}

module.exports = {
    startPath,
    step,
};
