import { Children, forwardRef, useRef } from "react";
import cn from "@/Libs/cn";
export default forwardRef(function Input(
    {
        label = null,
        wrapperClassName = "",
        inputClassName = "",
        className = "",
        children,
        prefix = "",
        suffix = "",
        error = "",
        ...props
    },
    ref
) {
    return (
        <div
            className={cn([
                "w-full  break-inside-avoid-column",
                wrapperClassName,
            ])}
        >
            {label ? (
                <span
                    className={` uppercase tracking-wide  text-xs  ${
                        error ? "text-red-500" : "text-[#878787]"
                    }`}
                >
                    {label}
                </span>
            ) : (
                ""
            )}
            <div className={cn([label ? "mt-3 " : "", className])}>
                <div className=" border-[#181818] bg-[#181818] border-2 rounded-md  flex items-center ">
                    {prefix}
                    <input
                        className={cn([
                            "text-[#FFF] min-w-[100px] bg-transparent !ring-0 !border-0 w-full hide-input-increment text-sm px-2 py-2",
                            inputClassName,
                        ])}
                        ref={ref}
                        {...props}
                    />
                    {suffix}
                </div>
                {children}
            </div>
            {error ? (
                <div className="text-red-500 text-xs mt-2">{error}</div>
            ) : (
                ""
            )}
        </div>
    );
});
