import { forwardRef } from "react";

export default forwardRef(function Block(
    { className, children, ...props },
    ref
) {
    return (
        <button
            className={` border-[#2D2D2D] border-2 rounded   ${className}`}
            {...props}
            ref={ref}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={146}
                height={36}
                fill="none"
                className="object-contain w-full"
            >
                <rect width={146} height={36} fill="#222" rx={4} />
            </svg>
        </button>
    );
});
