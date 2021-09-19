import React, { useRef, useEffect } from 'react';

const Canvas = ({ click, draw }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        draw(context);
    }, [draw]);

    return (
        <canvas
            width={window.innerWidth * 0.7}
            height={window.innerHeight * 0.7}
            onClick={(e) => {
                click(canvasRef.current, e);
            }}
            ref={canvasRef}
        ></canvas>
    );
};

export default Canvas;
