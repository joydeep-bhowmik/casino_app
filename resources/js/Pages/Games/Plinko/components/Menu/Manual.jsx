import React from "react";

const Manual = ({ randomTraverse, betStarted }) => {
    return (
        <div>
            <button
                onClick={() => {
                    randomTraverse(1.3);
                }}
                className="bet-button"
                disabled={betStarted ? true : null}
            >
                Bet
            </button>
        </div>
    );
};

export default Manual;
