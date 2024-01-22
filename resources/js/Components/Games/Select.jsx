import { forwardRef } from "react";

export default forwardRef(function Select(
    { children, className, label, ...props },
    ref
) {
    return (
        <div className="w-full ">
            <span className="uppercase tracking-wide font-bold text-xs text-slate-600">
                {label ? label : ""}
            </span>
            <select
                className={`bg rounded-md  w-full mt-3 !border-0 !ring-0  ${className}`}
                ref={ref}
                {...props}
            >
                {children}
            </select>
        </div>
    );
});
