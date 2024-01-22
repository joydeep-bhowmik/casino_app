import { forwardRef } from "react";

export default forwardRef(function Gem({ className, children, ...props }, ref) {
    return (
        <button
            className={` bg-[#15351E] border-2 rounded border-[#00C044] h-10 w-10 ${className} `}
            style={{
                backgroundImage: `url(${url("/assets/img/gem.png")})`,
                backgroundSize: "cover",
            }}
            {...props}
            ref={ref}
        >
            {children}
        </button>
    );
});
