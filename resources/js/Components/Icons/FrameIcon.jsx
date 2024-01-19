import React from "react";

export default function FrameIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                stroke="#959595"
                strokeLinecap="square"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.5 4.778V2h-3v5M14.5 4.778V2h3v5"
            ></path>
            <path
                fill="#959595"
                stroke="#959595"
                strokeLinecap="square"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.5 10a5 5 0 015-5h3a5 5 0 015 5v10a2 2 0 01-2 2h-9a2 2 0 01-2-2V10z"
            ></path>
            <path
                stroke="#959595"
                strokeLinecap="square"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.5 14.5h-3v5h3M18.5 14.5h3v5h-3"
            ></path>
            <path
                stroke="#111"
                strokeLinecap="square"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 11.5v2M8.5 11.5h7"
            ></path>
        </svg>
    );
}
