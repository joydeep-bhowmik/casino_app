import { forwardRef } from "react";

export default forwardRef(function Block(
    { className, children, ...props },
    ref
) {
    return (
        <button
            className={` bg-[#2D2D2D] border-[#2D2D2D] border-2 rounded  h-10 w-10  ${className}`}
            {...props}
            ref={ref}
        >
            {children}
        </button>
    );
});
