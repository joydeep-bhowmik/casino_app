import React from "react";

export default function Block(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            fill="none"
            viewBox="0 0 80 80"
            {...props}
        >
            <g>
                <path
                    fill="#2D2D2D"
                    d="M0 8a8 8 0 018-8h64a8 8 0 018 8v64a8 8 0 01-8 8H8a8 8 0 01-8-8V8z"
                ></path>
                <g fill="#616161">
                    <path d="M40 40H25v15h15V40zM55 25H40v15h15V25z"></path>
                </g>
            </g>
        </svg>
    );
}
