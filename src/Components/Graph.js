import React, { useState } from 'react';

//Components
import Canvas from './Canvas';
import GraphOptions from './GraphOptions';

//Style
import style from '../Styles/graph.module.css';

//Pathfinding
const dijkstra = require('../Pathfinding/dijkstra');
const aStar = require('../Pathfinding/aStar');

const Graph = () => {
    const [vertices, setVertices] = useState([]);
    const [edges, setEdges] = useState([]);
    const [clickType, setClickType] = useState(0); //0: vertices, 1: edges, 2: remove
    const [graphType, setGraphtype] = useState('directed');
    const [algorithm, setAlgorithm] = useState('Dijkstra');
    const [pathfindingState, setPathfindingState] = useState('ready');
    const [fields, setFields] = useState({ start: undefined, end: undefined });

    const testSetup = () => {
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
        setVertices([...testV]);
        setEdges([...testE]);
    };

    const circleRadius = 30;

    const drawVertices = (ctx) => {
        drawEdges(ctx);
        vertices.forEach((vertex) => {
            ctx.fillStyle = vertex.color.outer;
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, circleRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = vertex.color.inner;
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, circleRadius * 0.85, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.font = '20px Arial';
            ctx.fillText(vertex.id, vertex.x - 5, vertex.y + 5);
        });
    };

    const drawEdges = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.lineWidth = 3;
        edges.forEach((e) => {
            ctx.fillStyle = e.color;
            ctx.strokeStyle = e.color;
            ctx.beginPath();
            ctx.moveTo(vertices[e.from].x, vertices[e.from].y);
            ctx.lineTo(vertices[e.to].x, vertices[e.to].y);
            ctx.stroke();
            if (graphType === 'directed') {
                const middle = middleOfEdge(vertices[e.from], vertices[e.to]);
                const trianglePoints = calcTrianglePoints(vertices[e.from], vertices[e.to], middle);
                ctx.beginPath();
                ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y);
                ctx.lineTo(trianglePoints[1].x, trianglePoints[1].y);
                ctx.lineTo(trianglePoints[2].x, trianglePoints[2].y);
                ctx.lineTo(trianglePoints[0].x, trianglePoints[0].y);
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y);
                ctx.lineTo(trianglePoints[1].x, trianglePoints[1].y);
                ctx.stroke();
            }
        });
    };

    const canvasClick = (ctx, event) => {
        if (clickType === 0) {
            createVertex(ctx, event);
        } else if (clickType === 1) {
            createEdge(ctx, event);
        } else if (clickType === 2) {
            removeVertex(ctx, event);
        } else if (clickType === 3) {
            removeEdge(ctx, event);
        } else {
            console.error('Something is wrong');
        }
    };

    const createVertex = (ctx, event) => {
        const rect = ctx.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (checkVertexIntesection(x, y) === false) {
            setVertices([...vertices, new vertex(vertices.length, x, y)]);
        }
    };

    const [edgeStart, setStartEdge] = useState({ start: undefined });

    const createEdge = (ctx, event) => {
        const rect = ctx.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const interSection = checkVertexIntesection(x, y);
        if (interSection !== false) {
            if (edgeStart.start === undefined) {
                setStartEdge({ ...edgeStart, start: interSection });
                const withColor = vertices;
                withColor[interSection].color.inner = '#4678d6';
                withColor[interSection].color.outer = '#1d266f';
                setVertices([...withColor]);
            } else if (edgeStart.start !== undefined) {
                if (edgeDoesntExist(edgeStart.start, interSection, edges)) {
                    const newEdge = new edge(edges.length, edgeStart.start, interSection, '#000000');
                    setEdges([...edges, newEdge]);
                }
                const standardColor = vertices;
                standardColor[edgeStart.start].color.inner = edgeStart.start === fields.start ? '#00ff00' : edgeStart.start === fields.end ? '#ff0000' : '#97bc62';
                standardColor[edgeStart.start].color.outer = '#2c5f2d';
                setStartEdge({ ...edgeStart, start: interSection });
                standardColor[interSection].color.inner = '#4678d6';
                standardColor[interSection].color.outer = '#1d266f';
                setVertices([...standardColor]);
            }
        } else {
            setStartEdge({ ...edgeStart, start: undefined });
            if (edgeStart.start !== undefined) {
                const standardColor = vertices;
                standardColor[edgeStart.start].color.inner = edgeStart.start === fields.start ? '#00ff00' : edgeStart.start === fields.end ? '#ff0000' : '#97bc62';
                standardColor[edgeStart.start].color.outer = '#2c5f2d';
                setVertices([...standardColor]);
            }
        }
    };

    const removeVertex = (ctx, event) => {
        const rect = ctx.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const vertexIntesect = checkVertexIntesection(x, y);
        if (vertexIntesect !== false) {
            const newVertices = vertices;
            newVertices.splice(vertexIntesect, 1);
            setVertices([...newVertices]);
            removeEdgesIncludingVertex(vertexIntesect);
        }
    };

    const checkVertexIntesection = (x, y) => {
        for (let i = 0; i < vertices.length; i++) {
            if (distance([x, y], [vertices[i].x, vertices[i].y]) <= circleRadius * 2.2) {
                return i;
            }
        }
        return false;
    };

    const removeEdgesIncludingVertex = (vertex) => {
        const newEdges = edges;
        for (let i = 0; i < newEdges.length; i++) {
            if (newEdges[i].to === vertex || newEdges[i].from === vertex) {
                newEdges.splice(i, 1);
                i--;
            }
        }
        setEdges([...newEdges]);
    };

    const removeEdge = (ctx, event) => {
        const rect = ctx.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let closest = { edge: undefined, distance: Infinity };
        for (let i = 0; i < edges.length; i++) {
            const distToEdge = distPointToLineSegment({ x, y }, { x: vertices[edges[i].from].x, y: vertices[edges[i].from].y }, { x: vertices[edges[i].to].x, y: vertices[edges[i].to].y });
            if (distToEdge < closest.distance) {
                closest.edge = i;
                closest.distance = distToEdge;
            }
        }
        //125 distance is pretty close i think
        if (closest.distance < 85) {
            const newEdges = edges;
            newEdges.splice(closest.edge, 1);
            setEdges([...newEdges]);
        }
    };

    //Functions for props
    const changeType = (type) => {
        setClickType(type);
    };

    const changeGraphtype = (type) => {
        setGraphtype(type);
    };

    const changeAlgorithm = (algorithm) => {
        if (pathfindingState === 'ready') {
            setAlgorithm(algorithm);
        }
    };

    const algoStep = () => {
        if (fields.start !== undefined && fields.end !== undefined) {
            if (pathfindingState === 'ready') {
                startAlgo();
            }
            const typeForAlgo = { type: 'graph' };
            const step = algorithm === 'Dijkstra' ? dijkstra.step(fields.end, fields.start, typeForAlgo) : aStar.step(fields.end, fields.start, typeForAlgo);
            console.log(step);
            if (step.msg === 'running') {
                const newVertices = vertices;
                if (step.field.from !== -1) {
                    newVertices[step.field.from].color.inner = '#808080';
                }
                newVertices[step.field.to].color.inner = '#ffff00';
                setVertices([...newVertices]);
            }
            if (step.msg === 'done') {
                if (step.path.length > 0) {
                    const newVertices = vertices;
                    newVertices[fields.start].color.inner = '#00ff00';
                }
                setFinishedPath(step.path);
            }
        }
    };

    const startAlgo = () => {
        if (pathfindingState === 'ready' && fields.start !== undefined && fields.end !== undefined) {
            console.log('tr');
            if (algorithm === 'Dijkstra') {
                dijkstra.startPath(fields.start, { type: 'graph', graph: { vertices, edges, graphType } });
                setPathfindingState('dijkstra');
            } else if (algorithm === 'Astar') {
                console.log('aaa');
                aStar.startPath(fields.start, { type: 'graph', graph: { vertices, edges, graphType } });
                setPathfindingState('Astar');
            }
        }
    };

    const setFinishedPath = (path) => {
        console.log(path);
        const newEdges = edges;
        let lastV = fields.end;
        for (let v of path) {
            newEdges.push(new edge(newEdges.length, v, lastV, '#90ee90'));
            lastV = v;
        }
        newEdges.push(new edge(newEdges.length, fields.start, lastV, '#90ee90'));
        setEdges([...newEdges]);
    };

    const clearGraph = () => {
        setEdges([]);
        setVertices([]);
    };

    const setField = (field, to) => {
        const oldField = fields[field];
        setFields({ ...fields, [field]: to });
        const newColor = vertices;
        if (fields[field] !== undefined) {
            newColor[oldField].color.inner = '#97bc62';
            newColor[oldField].color.newouter = '#2c5f2d';
        }
        newColor[to].color.inner = field === 'start' ? '#00ff00' : '#ff0000';
        setVertices([...newColor]);
    };

    return (
        <div className={style.graphContainer}>
            <button onClick={() => testSetup()}>Setup simple</button>
            <h1>Graph</h1>
            <GraphOptions
                style={style}
                change={changeType}
                currentMark={clickType}
                changeGraphtype={changeGraphtype}
                changeAlgorithm={changeAlgorithm}
                step={algoStep}
                clear={clearGraph}
                fields={fields}
                setField={setField}
                amountOfVertices={vertices.length}
            />
            <Canvas click={canvasClick} draw={drawVertices} drawType={clickType} />
        </div>
    );
};

function distance(first, second) {
    const base = Math.pow(second[1] - first[1], 2) + Math.pow(second[0] - first[0], 2);
    return Math.sqrt(base);
}

function middleOfEdge(v1, v2) {
    const x = (v1.x + v2.x) / 2;
    const y = (v1.y + v2.y) / 2;
    return { x, y };
}

function calcTrianglePoints(v1, v2, middle) {
    //the actual edge
    const lineM = (v2.y - v1.y) / (v2.x - v1.x);
    const lineB = v1.y - lineM * v1.x;
    //the perp line
    const perpM = -1 / lineM; //slope
    const perpB = middle.y - perpM * middle.x; //y-intercept
    //the two points for the line are the perps intersection with a circle from middle
    //very helpful link: https://cscheng.info/2016/06/09/calculate-circle-line-intersection-with-javascript-and-p5js.html
    const circle = { radius: 20, xCenter: middle.x, yCenter: middle.y };
    const line = { slope: lineM, yIntercept: lineB };
    const perpLine = { slope: perpM, yIntercept: perpB };
    //the two points for the smalle perpendicular line
    const perplinePoints = lineCircleInterception(perpLine, circle);
    //the two points on the line, use the one closest to the end vertex/v2
    const linePoints = lineCircleInterception(line, circle);
    const correctPoint = distance([v2.x, v2.y], [linePoints[0].x, linePoints[0].y]) < distance([v2.x, v2.y], [linePoints[1].x, linePoints[1].y]) ? linePoints[0] : linePoints[1];
    return [perplinePoints[0], perplinePoints[1], correctPoint];
}

function lineCircleInterception(line, circle) {
    const a = 1 + Math.pow(line.slope, 2);
    const b = -circle.xCenter * 2 + line.slope * (line.yIntercept - circle.yCenter) * 2;
    const c = Math.pow(circle.xCenter, 2) + Math.pow(line.yIntercept - circle.yCenter, 2) - Math.pow(circle.radius, 2);

    //find the discriminant
    //const d = Math.pow(b, 2) - 4 * a * c; // if d > 0: two intersections, d = 0: one intersection/tangent, d < 0: no intersection
    //find xintersections by the quadratic formula
    const xintersections = [(-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a), (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)];
    const p1 = { x: xintersections[0], y: line.slope * xintersections[0] + line.yIntercept };
    const p2 = { x: xintersections[1], y: line.slope * xintersections[1] + line.yIntercept };
    return [p1, p2];
}

function edgeDoesntExist(start, end, edges) {
    for (let i = 0; i < edges.length; i++) {
        if (edges[i].from === start && edges[i].to === end) {
            return false;
        }
    }
    return true;
}

function distPointToLineSegment(point, startLine, endLine) {
    const l2 = distHelper(startLine, endLine);
    if (l2 === 0) return distHelper(point, startLine);
    let t = ((point.x - startLine.x) * (endLine.x - startLine.x) + (point.y - startLine.y) * (endLine.y - startLine.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return distHelper(point, { x: startLine.x + t * (endLine.x - startLine.x), y: startLine.y + t * (endLine.y - startLine.y) });
}

function distHelper(startLine, endLine) {
    return Math.pow(startLine.x - endLine.x, 2) + Math.pow(startLine.y - endLine.y, 2);
}

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

export default Graph;
