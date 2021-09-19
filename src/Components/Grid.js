import React, { useState } from 'react';

import styleSheeet from '../Styles/grid.module.css';

import Table from './Table';

const dijkstra = require('../Pathfinding/dijkstra');
const aStar = require('../Pathfinding/aStar');

const Grid = () => {
    //const [algorithm, setAlgorithm] = useState('dijksta');

    const [changeWhat, setChangeWhat] = useState(0);

    const [fields, setFields] = useState({ start: 11, end: 13 });

    const [dimensions, setDimension] = useState({ width: 10, height: 10 });

    const maze = gridMaker(dimensions.width, dimensions.height, fields.start, fields.end);

    const [grid, setGrid] = useState(maze);

    const changeDimension = (what, value) => {
        /* For individual height and width, problems with calculating pos from id
        const old = dimensions;
        old[what] = parseInt(value);
        setDimension({ ...old });
        */
        const newDim = { width: parseInt(value) };
        newDim.height = parseInt(value);
        setDimension({ ...newDim });
        const newGrid = gridMaker(dimensions.width, dimensions.height, fields.start, fields.end);
        setGrid({ ...newGrid });
    };

    const changeChanger = (to) => {
        setChangeWhat(to);
    };

    const changeField = (to) => {
        if (changeWhat !== 0) {
            const oldFields = fields;
            if (changeWhat === 1) {
                oldFields.start = to;
                setFields({ ...oldFields });
            } else if (changeWhat === 2) {
                oldFields.end = to;
                setFields({ ...oldFields });
            }
            if (pathFindingState === 2) setPathfindingState(0);
            const newGrid = gridMaker(dimensions.width, dimensions.height, fields.start, fields.end);
            setGrid({ ...grid, fields: newGrid.fields });
        } else {
            if (to !== fields.start && to !== fields.end) {
                const newGrid = grid.fields;
                const place = idToArrayplace(to);
                newGrid[place[0]][place[1]].state = newGrid[place[0]][place[1]].state === 1 ? 3 : 1;
                newGrid[place[0]][place[1]].bg = newGrid[place[0]][place[1]].bg === 'white' ? 'black' : 'white';
                setGrid({ ...grid, fields: newGrid });
            }
        }
    };

    const [pathFindingState, setPathfindingState] = useState(0);

    const step = (type) => {
        let newGrid = grid.fields;
        if (pathFindingState === 0) {
            start(type);
        }
        const graphType = { type: 'grid', grid };
        if (pathFindingState !== 3) {
            let progress;
            if (type === 'd') {
                progress = dijkstra.step(fields.end, fields.start, graphType);
                setPathfindingState(1);
            } else if (type === 'a') {
                progress = aStar.step(fields.start, fields.end, graphType);
                setPathfindingState(2);
            }
            if (progress.msg === 'done') {
                for (let i = 0; i < progress.path.length; i++) {
                    const place = idToArrayplace(progress.path[i]);
                    newGrid[place[0]][place[1]].bg = 'yellow';
                }
                setPathfindingState(3);
                setGrid({ ...grid, fields: newGrid });
            } else if (progress.msg === 'running' && progress.field !== fields.start) {
                const newGrid = grid.fields;
                const place = idToArrayplace(progress.field);
                newGrid[place[0]][place[1]].bg = 'green';
                setGrid({ ...grid, fields: newGrid });
            }
        } else {
            const newRun = gridMaker(dimensions.width, dimensions.height, fields.start, fields.end);
            setGrid({ ...grid, fields: newRun.fields });
            setPathfindingState(0);
        }
    };

    const start = (type) => {
        if (type === 'd') {
            dijkstra.startPath(fields.start, { type: 'grid', grid });
        } else if (type === 'a') {
            aStar.startPath(fields.start, { type: 'grid', grid });
        }

        setPathfindingState(1);
    };

    const idToArrayplace = (id) => {
        let row = Math.floor(id / dimensions.height);
        let col = id % dimensions.height;
        return [row, col];
    };

    return (
        <div className={styleSheeet.grid}>
            <div className={styleSheeet.options}>
                <ul>
                    <h4>Change</h4>
                    <div className={styleSheeet.combination}>
                        <input
                            type="radio"
                            id="Walls"
                            name="selector"
                            checked={changeWhat === 0 ? 'checked' : ''}
                            onChange={(e) => {
                                changeChanger(parseInt(e.target.value));
                            }}
                            value="0"
                        />
                        <label htmlFor="Walls">Walls</label>
                    </div>
                    <div className={styleSheeet.combination}>
                        <input
                            type="radio"
                            id="Startfield"
                            name="selector"
                            checked={changeWhat === 1 ? 'checked' : ''}
                            onChange={(e) => {
                                changeChanger(parseInt(e.target.value));
                            }}
                            value="1"
                        />
                        <label htmlFor="Startfield">Startfield</label>
                    </div>
                    <div className={styleSheeet.combination}>
                        <input
                            type="radio"
                            id="Endfield"
                            name="selector"
                            checked={changeWhat === 2 ? 'checked' : ''}
                            onChange={(e) => {
                                changeChanger(parseInt(e.target.value));
                            }}
                            value="2"
                        />
                        <label htmlFor="Endfield">Endfield</label>
                    </div>
                </ul>
                <div className={styleSheeet.dimensions}>
                    <h4>More changes</h4>
                    <p>
                        Width:
                        <input
                            type="number"
                            value={dimensions.width}
                            onChange={(e) => {
                                changeDimension('width', e.target.value);
                            }}
                        />
                    </p>
                    <p>
                        Height:
                        <input
                            type="number"
                            value={dimensions.height}
                            onChange={(e) => {
                                changeDimension('height', e.target.value);
                            }}
                        />
                    </p>
                </div>
                <div>
                    <h4>Algorithm step</h4>
                    <button
                        onClick={() => {
                            step(pathFindingState === 1 ? 'd' : 'a');
                        }}
                    >
                        {pathFindingState === 3 ? 'Clear' : pathFindingState === 1 ? 'Dijkstra' : 'A*'}
                    </button>
                    <button
                        onClick={() => {
                            step(pathFindingState === 2 ? 'a' : 'd');
                        }}
                    >
                        {pathFindingState === 3 ? 'Clear' : pathFindingState === 2 ? 'A*' : 'Dijkstra'}
                    </button>
                </div>
            </div>
            <Table grid={grid} styleSheeet={styleSheeet} changeField={changeField} />
        </div>
    );
};

export default Grid;
let Node = class {
    constructor(id, bg) {
        this.id = id;
        this.bg = bg;
        this.from = null;
        this.state = 1;
        this.distance = Infinity;
    }
};

const gridMaker = (w, h, start, end) => {
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
};
