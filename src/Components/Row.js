import React from 'react';

import Cell from './Cell';

const Row = ({ data, styles, heightP, changer }) => {
    return (
        <tr className={styles.row} style={{ height: heightP + '%' }}>
            {data.map((cell) => {
                return <Cell key={cell.id} changer={changer} styles={styles} cell={cell} width={100 / data.length} />;
            })}
        </tr>
    );
};

export default Row;
