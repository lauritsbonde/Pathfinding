import React, { useState } from 'react';

// Components
import Grid from '../Components/Grid';
import Graph from './Graph';

// Styles
import style from '../Styles/switcher.module.css';

const Switcher = () => {
    const [type, setType] = useState('graph');

    const switchType = (to) => {
        setType(to);
    };

    return (
        <>
            <div className={style.selector}>
                <ul>
                    <li
                        className={type === 'grid' ? style.active : style.std}
                        onClick={() => {
                            switchType('grid');
                        }}
                    >
                        Grid
                    </li>
                    <li
                        className={type === 'graph' ? style.active : style.std}
                        onClick={() => {
                            switchType('graph');
                        }}
                    >
                        Graph
                    </li>
                </ul>
            </div>
            <div className={style.container}>{type === 'grid' ? <Grid /> : <Graph />}</div>
        </>
    );
};

export default Switcher;
