import { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                "border-[#313131] py-3 rounded-md text-[#92f17f] focus:border-[#92f17f] focus:ring-[#75ce61] bg-[#242424] shadow-[var(--input-box-shadow)]" +
                className
            }
            ref={input}
        />
    );
});
