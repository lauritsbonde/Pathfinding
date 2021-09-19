import React from 'react';

const Cell = ({ changer, cell, styles, width }) => {
    return (
        <td
            onClick={() => {
                changer(cell.id);
            }}
            className={styles.cell}
            style={{ width: width + '%', backgroundColor: cell.bg }}
        >
            <p>{cell.id}</p>
            <p>{Math.round(cell.distance*100) /100}</p>
        </td>
    );
};

export default Cell;
