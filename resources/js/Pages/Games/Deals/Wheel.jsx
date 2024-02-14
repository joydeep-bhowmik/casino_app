import rand from "@/Libs/rand";
import { useEffect, useRef, useState } from "react";

export default function Wheel({
    percentage = 0,
    className,
    spin,
    result,
    time,
    disabled,
    callback = function () {},
    ...props
}) {
    const circleRef = useRef(null);
    const radiusRef = useRef(null);

    useEffect(() => {
        const circle = circleRef.current;

        const circumference =
            2 * Math.PI * parseFloat(circle.getAttribute("r"));

        const dashOffset = circumference * (1 - percentage / 100);

        circle.setAttribute("stroke-dasharray", circumference);

        circle.setAttribute("stroke-dashoffset", dashOffset);
    }, [percentage]);

    const getFinalDeg = (percentage, result) => {
        let starting = 90;

        let greenDegs = starting + (360 * percentage) / 100;

        let failedDeg = greenDegs + rand(2, 360 - (360 * percentage) / 100);

        let sucessDeg = greenDegs - rand(2, (360 * percentage) / 100);

        console.log(greenDegs, sucessDeg, failedDeg);

        return result ? sucessDeg : failedDeg;
    };

    useEffect(() => {
        let currentDeg = 0;

        radiusRef.current.style.transform = `rotate(${currentDeg}deg)`;

        if (spin) {
            let finalDeg = getFinalDeg(percentage, result) + 3 * 360;

            const rotateInterval = setInterval(() => {
                if (currentDeg <= finalDeg) {
                    radiusRef.current.style.transform = `rotate(${currentDeg}deg)`;

                    currentDeg++;
                } else {
                    callback();

                    clearInterval(rotateInterval);
                }
            }, 0);

            return () => clearInterval(rotateInterval); // Cleanup on component unmount or rerender
        }
    }, [result, spin]);

    return (
        <svg
            viewBox="0 0 662 590"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={` ${className}`}
        >
            <g filter="url(#filter0_d_153_23017) ">
                <g filter="url(#filter1_i_153_23017)">
                    <path
                        d="M331 566C480.117 566 601 445.117 601 296C601 146.883 480.117 26 331 26C181.883 26 61 146.883 61 296C61 445.117 181.883 566 331 566Z"
                        fill="#0B0B0B"
                    />
                </g>
                <g opacity={0.05}>
                    <path
                        d="M560 296C560 169.527 457.473 67 331 67C204.527 67 102 169.527 102 296C102 422.473 204.527 525 331 525C457.473 525 560 422.473 560 296Z"
                        stroke="#0D0D0D"
                        strokeWidth={56}
                        strokeDasharray="150 4"
                    />
                    <path
                        d="M560 296C560 169.527 457.473 67 331 67C204.527 67 102 169.527 102 296C102 422.473 204.527 525 331 525C457.473 525 560 422.473 560 296Z"
                        stroke="url(#paint0_radial_153_23017)"
                        strokeWidth={56}
                        strokeDasharray="150 4"
                    />
                </g>
                <g filter="url(#filter2_i_153_23017)">
                    <path
                        d="M331 496C441.457 496 531 406.457 531 296C531 185.543 441.457 96 331 96C220.543 96 131 185.543 131 296C131 406.457 220.543 496 331 496Z"
                        fill="#111111"
                    />
                </g>

                <g filter="url(#filter3_di_153_23017)">
                    <path
                        d="M331 468C425.993 468 503 390.993 503 296C503 201.007 425.993 124 331 124C236.007 124 159 201.007 159 296C159 390.993 236.007 468 331 468Z"
                        stroke="#222222"
                        strokeWidth={16}
                        shapeRendering="crispEdges"
                    />
                </g>

                <g filter="url(#filter4_i_153_23017)">
                    <path
                        d="M331 460C421.575 460 495 386.575 495 296C495 205.425 421.575 132 331 132C240.425 132 167 205.425 167 296C167 386.575 240.425 460 331 460Z"
                        fill="#111111"
                    />
                </g>
                <g opacity={0.2} filter="url(#filter5_f_153_23017)">
                    <path
                        d="M331 367C370.212 367 402 335.212 402 296C402 256.788 370.212 225 331 225C291.788 225 260 256.788 260 296C260 335.212 291.788 367 331 367Z"
                        fill="#DDF7FF"
                    />
                </g>
            </g>

            {/* Circle */}
            <circle
                ref={circleRef}
                cx={331}
                cy={296}
                r="173"
                stroke="#4991A9"
                strokeWidth="16"
                fill="none"
            />
            <foreignObject width="100%" height="100%" x={0} y={0}>
                <div className="h-full w-full absolute top-0 left-0 bottom-0 right-0 grid place-items-center">
                    <div
                        className={`relative h-[60%] w-[60%]   rounded-full duration-75 `}
                        ref={radiusRef}
                    >
                        <span className="absolute left-1/2 top-0 h-1/2 w-0.5 -translate-x-1/2 transform bg-white"></span>
                    </div>
                </div>
            </foreignObject>
            <defs>
                <filter
                    id="filter0_d_153_23017"
                    x={0}
                    y={0}
                    width={662}
                    height={662}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy={35} />
                    <feGaussianBlur stdDeviation={30.5} />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_153_23017"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_153_23017"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter1_i_153_23017"
                    x={61}
                    y={26}
                    width={540}
                    height={540}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation={1.5} />
                    <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2={-1}
                        k3={1}
                    />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_153_23017"
                    />
                </filter>
                <filter
                    id="filter2_i_153_23017"
                    x={131}
                    y={96}
                    width={400}
                    height={400}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation={19} />
                    <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2={-1}
                        k3={1}
                    />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_153_23017"
                    />
                </filter>
                <filter
                    id="filter3_di_153_23017"
                    x={149}
                    y={116}
                    width={364}
                    height={364}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy={2} />
                    <feGaussianBlur stdDeviation={1} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_153_23017"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_153_23017"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy={1} />
                    <feGaussianBlur stdDeviation={0.5} />
                    <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2={-1}
                        k3={1}
                    />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect2_innerShadow_153_23017"
                    />
                </filter>
                <filter
                    id="filter4_i_153_23017"
                    x={167}
                    y={132}
                    width={328}
                    height={328}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation={10.5} />
                    <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2={-1}
                        k3={1}
                    />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_153_23017"
                    />
                </filter>
                <filter
                    id="filter5_f_153_23017"
                    x={158}
                    y={123}
                    width={346}
                    height={346}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation={51}
                        result="effect1_foregroundBlur_153_23017"
                    />
                </filter>
                <radialGradient
                    id="paint0_radial_153_23017"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(398 539) rotate(-108.125) scale(496.643 12415.3)"
                >
                    <stop stopColor="#A5A5A5" />
                    <stop offset={0.494531} stopColor="#58D6FF" />
                    <stop offset={0.75} stopColor="#DDF7FF" />
                    <stop offset={1} stopColor="#012B39" />
                </radialGradient>
                <linearGradient
                    id="paint1_linear_153_23017"
                    x1={331}
                    y1={295.999}
                    x2={502.707}
                    y2={295.999}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#3B8F3E" />
                    <stop offset={0.984375} stopColor="#7DED81" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_153_23017"
                    x1={331}
                    y1={468}
                    x2={331}
                    y2={124}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#4991A9" />
                    <stop offset={1} stopColor="#6FCAE8" />
                </linearGradient>
            </defs>
        </svg>
    );
}
