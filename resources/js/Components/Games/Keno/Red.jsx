import { forwardRef } from "react";

export default forwardRef(function Red({ className, children, ...props }, ref) {
    return (
        <button
            className={`  bg-[#350F0] border-[#991A1A] text-red-500 border-2 rounded  h-10 w-10 ${className}`}
            {...props}
            ref={ref}
        >
            {children}
        </button>
    );
});
