import React, { forwardRef } from "react";

export default forwardRef(function MultiplierButton(
    { children, ...props },
    ref
) {
    return (
        <button
            {...props}
            ref={ref}
            className="bg-[#222] text-[#757575] border-[#222]  border-2 text-xs p-3 rounded font-bold uppercase tracking-widest"
        >
            {children}
        </button>
    );
});
