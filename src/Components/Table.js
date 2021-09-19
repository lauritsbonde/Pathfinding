import React from 'react';

import Row from './Row';

const Table = ({ styleSheeet, changeField, grid }) => {
    return (
        <>
            <table>
                <tbody>
                    {grid.fields.map((row, i) => {
                        return <Row key={i} styles={styleSheeet} data={row} heightP={100 / grid.length} changer={changeField} />;
                    })}
                </tbody>
            </table>
        </>
    );
};

export default Table;
