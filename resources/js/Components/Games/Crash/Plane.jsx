// Plane.js

import React, { useEffect, useRef, useState } from "react";

export default function Plane({ isMovingDown }) {
    const canvasWidth = 500;
    const canvasHeight = 300;

    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    const [position, setPosition] = useState({ x: 0, y: canvasHeight });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const image = new Image();
        image.src = "/assets/img/plane.png"; // Replace with the actual path to your image
        imageRef.current = image;

        const imageWidth = 100;
        const imageHeight = 50;

        const lineLength = canvas.width;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            ctx.lineTo(position.x, position.y);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            if (isMovingDown) {
                ctx.save();
                ctx.translate(position.x, position.y - imageHeight);
                ctx.rotate(-31);
                ctx.drawImage(
                    imageRef.current,
                    -imageWidth / 2,
                    30,
                    imageWidth,
                    imageHeight
                );
                ctx.restore();

                // Move down until it touches the bottom wall
                if (position.y + 2 <= canvas.height) {
                    setPosition((prevPosition) => ({
                        ...prevPosition,
                        x: prevPosition.x + 2,
                        y: prevPosition.y + 2,
                    }));
                }
            } else {
                ctx.save();
                ctx.translate(position.x, position.y - imageHeight);
                ctx.rotate(0);
                ctx.drawImage(
                    imageRef.current,
                    -imageWidth / 2,
                    30,
                    imageWidth,
                    imageHeight
                );
                ctx.restore();

                // Move up until it touches the top wall
                if (position.y - (canvas.height / lineLength) * 200 >= 0) {
                    setPosition((prevPosition) => ({
                        ...prevPosition,
                        x: prevPosition.x + 2,
                        y: prevPosition.y - (canvas.height / lineLength) * 2,
                    }));
                }
            }
        };

        const animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isMovingDown, position]);

    return (
        <canvas
            ref={canvasRef}
            style={{ background: "black", border: "1px solid red" }}
        />
    );
}
