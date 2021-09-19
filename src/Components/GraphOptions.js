import React from 'react';

const GraphOptions = ({ style, change, currentMark, changeGraphtype, changeAlgorithm, step, clear, fields, setField, amountOfVertices }) => {
    let fieldOptions = { start: [], end: [] };

    if (fields.start === undefined) {
        fieldOptions.start.push('none');
    }

    if (fields.end === undefined) {
        fieldOptions.end.push('none');
    }

    for (let i = 0; i < amountOfVertices; i++) {
        fieldOptions.start.push(i);
        fieldOptions.end.push(i);
    }

    return (
        <div className={style.options}>
            <div className={style.clickChanges}>
                <h3>Click</h3>
                <div>
                    <input
                        type="radio"
                        id="Vertices"
                        name="options"
                        value="0"
                        checked={currentMark === 0}
                        onChange={() => {
                            change(0);
                        }}
                    />
                    <label htmlFor="Vertices">Vertices</label>
                    <input
                        type="radio"
                        id="Edges"
                        name="options"
                        value="1"
                        checked={currentMark === 1}
                        onChange={() => {
                            change(1);
                        }}
                    />
                    <label htmlFor="Edges">Edges</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="RemoveV"
                        name="options"
                        value="2"
                        checked={currentMark === 2}
                        onChange={() => {
                            change(2);
                        }}
                    />
                    <label htmlFor="RemoveV">Remove Vertices</label>
                    <input
                        type="radio"
                        id="RemoveE"
                        name="options"
                        value="2"
                        checked={currentMark === 3}
                        onChange={() => {
                            change(3);
                        }}
                    />
                    <label htmlFor="RemoveE">Remove Edges</label>
                </div>
            </div>
            <div className={style.graphType}>
                <h3>Graph type</h3>
                <select
                    onChange={(e) => {
                        changeGraphtype(e.target.value);
                    }}
                >
                    <option value="directed">Directed</option>
                    <option value="undirected">Undirected</option>
                </select>
            </div>
            <div className={style.algorithms}>
                <h3>Algorithms</h3>
                <select
                    onChange={(e) => {
                        changeAlgorithm(e.target.value);
                    }}
                >
                    <option value="Dijkstra">Dijkstra</option>
                    <option value="Astar">A*</option>
                </select>
                <button
                    onClick={() => {
                        step();
                    }}
                >
                    Step
                </button>
            </div>
            <div className={style.clear}>
                <h3>Fields</h3>
                <p>
                    Starting field: {fields.start === undefined ? 'undefined' : fields.start}, change:
                    <select
                        defaultValue={fields.start}
                        onChange={(e) => {
                            setField('start', parseInt(e.target.value));
                        }}
                    >
                        {fieldOptions.start.map((vertex) => {
                            return (
                                <option value={vertex} key={vertex} disabled={vertex === fields.end}>
                                    {vertex}
                                </option>
                            );
                        })}
                    </select>
                </p>
                <p>
                    Ending field: {fields.end === undefined ? 'undefined' : fields.end}, change:
                    <select
                        defaultValue={fields.end}
                        onChange={(e) => {
                            setField('end', parseInt(e.target.value));
                        }}
                    >
                        {fieldOptions.end.map((vertex) => {
                            return (
                                <option value={vertex} key={vertex} disabled={vertex === fields.start}>
                                    {vertex}
                                </option>
                            );
                        })}
                    </select>
                </p>
                <button
                    onClick={() => {
                        clear();
                    }}
                >
                    Clear graph
                </button>
            </div>
        </div>
    );
};

export default GraphOptions;
