import { forwardRef } from "react";

export default forwardRef(function PrimaryButton(
    { className = "", disabled, children, ...props },
    ref
) {
    return (
        <button
            {...props}
            className={
                `primary-btn inline-flex  items-center justify-center p-4  border border-transparent  font-semibold 
            text-xs uppercase tracking-widest ${disabled && "opacity-25"} ` +
                className
            }
            disabled={disabled}
            ref={ref}
        >
            {children}
        </button>
    );
});
