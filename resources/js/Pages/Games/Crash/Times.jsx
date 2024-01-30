import React from "react";

export default function Times({ className, value = 0 }) {
    const generateValues = (inputValue) => {
        const higherValues = [
            (inputValue + 0.2).toFixed(1),
            (inputValue + 0.4).toFixed(1),
        ];
        const lowerValues = [
            (inputValue - 0.2).toFixed(1),
            (inputValue - 0.4).toFixed(1),
            (inputValue - 0.6).toFixed(1),
        ];
        const allValues = [
            ...lowerValues,
            inputValue.toFixed(1),
            ...higherValues,
        ];
        return allValues;
    };

    const generatedValues = generateValues(value);

    return (
        <div className={className}>
            {generatedValues.map((v, index) => (
                <div
                    key={index}
                    className={
                        (v == value ? "text-green-500" : "") +
                        " " +
                        (index == 3 ? "md:block hidden" : "")
                    }
                >
                    {v}s
                </div>
            ))}
        </div>
    );
}
