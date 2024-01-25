import React, { useRef } from "react";

const Balance = ({ handleBalance, balance, betStarted }) => {
    const inputRef = useRef();

    return (
        <div>
            Current balance: <span id="balance">{balance}</span>{" "}
        </div>
    );
};

export default Balance;
