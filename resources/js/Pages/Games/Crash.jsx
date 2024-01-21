import React, { useEffect, useRef } from "react";

const Crash = () => {
    const canvasWidth = 500; // Set your desired canvas width
    const canvasHeight = 300; // Set your desired canvas height

    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set canvas size
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Load image
        const image = new Image();
        image.src = url("/assets/img/plane.png"); // Replace with the actual path to your image
        imageRef.current = image;

        // Set image width and height
        const imageWidth = 100; // Set your desired width
        const imageHeight = 50; // Set your desired height

        // Initial position and size of the line
        let x = 0;
        let y = canvas.height;
        let lineLength = canvas.width;

        // Flag to indicate the direction of movement
        let isMovingDown = false;

        // Animation function
        const animate = () => {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the white line
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            ctx.lineTo(x, y);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw the rotated image on top of the line with specified width and height
            if (!isMovingDown) {
                ctx.save();
                ctx.translate(x, y - imageHeight);
                ctx.rotate(0); // No rotation when going up
                ctx.drawImage(
                    imageRef.current,
                    -imageWidth / 2,
                    30,
                    imageWidth,
                    imageHeight
                ); // Move image closer to the line
                ctx.restore();
            } else {
                ctx.save();
                ctx.translate(x, y - imageHeight);
                ctx.rotate(-31); // Rotate 180 degrees when going down
                ctx.drawImage(
                    imageRef.current,
                    -imageWidth / 2,
                    30,
                    imageWidth,
                    imageHeight
                ); // Move image closer to the line
                ctx.restore();
            }

            // Update position for the next frame
            if (!isMovingDown) {
                x += 2;
                y -= (canvas.height / lineLength) * 2;

                // Check if the line has reached the middle of the right border
                if (x >= canvas.width / 2) {
                    // Set the flag to indicate moving down
                    isMovingDown = true;
                }
            } else {
                // Move down to the bottom-right corner
                x += 2;
                y += 2;

                // Check if the line has reached the bottom-right corner
                if (x >= canvas.width && y >= canvas.height) {
                    // Reset the position to start the next V shape
                    x = 0;
                    y = canvas.height;
                    isMovingDown = false;
                }
            }

            // Request the next animation frame
            requestAnimationFrame(animate);
        };

        // Start the animation
        animate();

        // Cleanup function
        return () => cancelAnimationFrame(animate);
    }, []);

    return <canvas ref={canvasRef} style={{ background: "black" }} />;
};

export default Crash;
