const pq = require('./pq');

const graph = require('./Graph');

function startPath(start, type) {
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
    const currentPlace = pq.dequeue();
    graph.getDigraph().vertices[currentPlace.id].state = 3;

    if (currentPlace.id === end) {
        pq.reset();
        return { msg: 'done', path: found(currentPlace.id, start) };
    }

    graph.getDigraph().edges[currentPlace.id].forEach((cell) => {
        // states 1: 'clear', 2: 'in pq', 3: 'dequed/wall(maybe make wall another state)'
        if (graph.getDigraph().vertices[cell].state === 3) {
            return;
        } else if (graph.getDigraph().vertices[cell].state === 2) {
            //should the manhatten distance not be from the start
            let distance;
            if (graphType.type === 'grid') {
                distance = manhattanDistance(currentPlace.id, cell, graphType.grid.dimensions) + graph.getDigraph().vertices[currentPlace.id].distance;
            } else if (graphType.type === 'graph') {
                //TODO: get the actial distance of the edge;
                distance = 1;
            }
            if (distance < graph.getDigraph().vertices[cell].distance) {
                pq.insert(cell, distance);
                graph.getDigraph().vertices[cell].from = currentPlace.id;
                graph.getDigraph().vertices[cell].distance = distance;
                graph.getDigraph().vertices[cell].state = 2;
            }
        } else {
            let distance;
            if (graphType.type === 'grid') {
                distance = manhattanDistance(currentPlace.id, cell, graphType.grid.dimensions) + graph.getDigraph().vertices[currentPlace.id].distance;
            } else if (graphType.type === 'graph') {
                //TODO: get the actial distance of the edge;
                distance = 1;
            }
            pq.insert(cell, distance);
            graph.getDigraph().vertices[cell].from = currentPlace.id;
            graph.getDigraph().vertices[cell].distance = distance;
            graph.getDigraph().vertices[cell].state = 2;
        }
    });
    return { msg: 'running', field: { from: graph.getDigraph().vertices[currentPlace.id].from, to: currentPlace.id } };
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

function manhattanDistance(first, second, dimensions) {
    const p1 = toCoord(first, dimensions);
    const p2 = toCoord(second, dimensions);
    return Math.abs(p2[0] - p1[0]) + Math.abs(p2[1] - p1[1]);
}

function toCoord(point, dimensions) {
    let row = Math.floor(point / dimensions.height);
    let col = point % dimensions.width;
    return [row, col];
}

module.exports = {
    startPath,
    step,
};
