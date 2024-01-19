import React from "react";
// width="31"
//     height="30"
export default function NotificationIcon({ active, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 31 30"
            fill="none"
            {...props}
        >
            {active ? (
                <g filter="url(#filter0_d_153_1838)">
                    <rect
                        x="16.8623"
                        y="7.6897"
                        width="7.13793"
                        height="7.13793"
                        rx="3.56897"
                        fill="#C43939"
                    />
                </g>
            ) : (
                ""
            )}
            <path
                d="M12.8987 17.2078C12.8987 15.9455 12.3972 14.735 11.5046 13.8424C10.6121 12.9498 9.40148 12.4484 8.1392 12.4484C6.87691 12.4484 5.66632 12.9498 4.77375 13.8424C3.88117 14.735 3.37973 15.9455 3.37973 17.2078C3.37973 22.7605 1 24.347 1 24.347H15.2784C15.2784 24.347 12.8987 22.7605 12.8987 17.2078Z"
                stroke="#959595"
                strokeWidth="1.5"
                strokeLinecap="square"
                strokeLinejoin="round"
            />
            <path
                d="M9.51123 27.5199C9.37176 27.7603 9.17159 27.9599 8.93075 28.0986C8.68991 28.2373 8.41685 28.3103 8.13891 28.3103C7.86098 28.3103 7.58792 28.2373 7.34708 28.0986C7.10623 27.9599 6.90606 27.7603 6.7666 27.5199"
                stroke="#959595"
                strokeWidth="1.5"
                strokeLinecap="square"
                strokeLinejoin="round"
            />
            <defs>
                <filter
                    id="filter0_d_153_1838"
                    x="9.8623"
                    y="0.689697"
                    width="21.1377"
                    height="21.1379"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="3.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.764706 0 0 0 0 0.223529 0 0 0 0 0.223529 0 0 0 0.5 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_153_1838"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_153_1838"
                        result="shape"
                    />
                </filter>
            </defs>
        </svg>
    );
}
