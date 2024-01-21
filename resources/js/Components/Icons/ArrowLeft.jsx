import React from "react";

export default function ArrowLeft(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="33"
            fill="none"
            viewBox="0 0 28 33"
            {...props}
        >
            <g filter="url(#filter0_d_153_15699)">
                <path
                    stroke="url(#paint0_linear_153_15699)"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                    strokeWidth="1.94"
                    d="M15.701 21.403L11 16.702 15.701 12"
                    shapeRendering="crispEdges"
                ></path>
            </g>
            <defs>
                <filter
                    id="filter0_d_153_15699"
                    width="27.043"
                    height="32.146"
                    x="0.03"
                    y="0.628"
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                >
                    <feFlood
                        floodOpacity="0"
                        result="BackgroundImageFix"
                    ></feFlood>
                    <feColorMatrix
                        in="SourceAlpha"
                        result="hardAlpha"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    ></feColorMatrix>
                    <feOffset></feOffset>
                    <feGaussianBlur stdDeviation="5"></feGaussianBlur>
                    <feComposite in2="hardAlpha" operator="out"></feComposite>
                    <feColorMatrix values="0 0 0 0 0.258824 0 0 0 0 0.552941 0 0 0 0 0.247059 0 0 0 1 0"></feColorMatrix>
                    <feBlend
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_153_15699"
                    ></feBlend>
                    <feBlend
                        in="SourceGraphic"
                        in2="effect1_dropShadow_153_15699"
                        result="shape"
                    ></feBlend>
                </filter>
                <linearGradient
                    id="paint0_linear_153_15699"
                    x1="13.342"
                    x2="13.342"
                    y1="20.597"
                    y2="12"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#5AC35D"></stop>
                    <stop offset="0.984" stopColor="#7DED81"></stop>
                </linearGradient>
            </defs>
        </svg>
    );
}
