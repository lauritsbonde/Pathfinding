import React from 'react';

//Syle
import style from '../Styles/nav.module.css';

const Nav = ({ toChange }) => {
    return (
        <nav className={style.nav}>
            <ul className={style.list}>
                <h4>Algorithm</h4>
                <li>Dijkstra</li>
                <li>A*</li>
            </ul>
        </nav>
    );
};

export default Nav;
