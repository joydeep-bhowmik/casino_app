import React, { useState, useEffect } from "react";
import {
    Bodies,
    Body,
    Composite,
    Engine,
    Events,
    IEventCollision,
    Render,
    Runner,
    World,
} from "matter-js";

function getConfig() {
    const pins = {
        startPins: 3,
        pinSize: 8,
        pinGap: 36,
    };

    const ball = {
        ballSize: 5.7,
    };

    const engine = {
        engineGravity: 1.0,
    };

    const world = {
        width: 390,
        height: 390,
    };

    const colors = {
        background: "#000",
    };

    return {
        pins,
        ball,
        engine,
        world,
        colors,
    };
}
const config = getConfig();

const {
    pins: pinsConfig,
    colors,
    ball: ballConfig,
    engine: engineConfig,
    world: worldConfig,
} = config;

const worldWidth = worldConfig.width;

const worldHeight = worldConfig.height;

const Plinko = () => {
    const engine = Engine.create();
    const [lines, setLines] = useState(8);

    useEffect(() => {
        engine.gravity.y = engineConfig.engineGravity;
        const element = document.getElementById("plinko");

        const render = Render.create({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            element: element,
            bounds: {
                max: {
                    y: worldHeight,
                    x: worldWidth,
                },
                min: {
                    y: 0,
                    x: 0,
                },
            },
            options: {
                background: colors.background,
                hasBounds: true,
                width: worldWidth,
                height: worldHeight,
                wireframes: false,
            },
            engine,
        });

        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);
        return () => {
            World.clear(engine.world, true);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        };
    }, [lines]);

    const pins = [];

    for (let l = 0; l < lines; l++) {
        const linePins = pinsConfig.startPins + l;
        const lineWidth = linePins * pinsConfig.pinGap;
        for (let i = 0; i < linePins; i++) {
            const pinX =
                worldWidth / 2 -
                lineWidth / 2 +
                i * pinsConfig.pinGap +
                pinsConfig.pinGap / 2;

            const pinY =
                worldWidth / lines + l * pinsConfig.pinGap + pinsConfig.pinGap;

            const pin = Bodies.circle(pinX, pinY, pinsConfig.pinSize, {
                label: `pin-${i}`,
                render: {
                    fillStyle: "#F5DCFF",
                },
                isStatic: true,
            });
            pins.push(pin);
        }
    }

    const leftWall = Bodies.rectangle(
        worldWidth / 3 -
            pinsConfig.pinSize * pinsConfig.pinGap -
            pinsConfig.pinGap,
        worldWidth / 2 - pinsConfig.pinSize,
        worldWidth * 2,
        40,
        {
            angle: 90,
            render: {
                visible: false,
            },
            isStatic: true,
        }
    );

    const rightWall = Bodies.rectangle(
        worldWidth -
            pinsConfig.pinSize * pinsConfig.pinGap -
            pinsConfig.pinGap -
            pinsConfig.pinGap / 2,
        worldWidth / 2 - pinsConfig.pinSize,
        worldWidth * 2,
        40,
        {
            angle: -90,
            render: {
                visible: false,
            },
            isStatic: true,
        }
    );

    const floor = Bodies.rectangle(0, worldWidth + 10, worldWidth * 10, 40, {
        label: "block-1",
        render: {
            visible: false,
        },
        isStatic: true,
    });

    Composite.add(engine.world, [...pins, leftWall, rightWall, floor]);

    return (
        <div className="grid place-items-center h-screen">
            <div id="plinko" className="border w-fit "></div>
        </div>
    );
};

export default Plinko;
