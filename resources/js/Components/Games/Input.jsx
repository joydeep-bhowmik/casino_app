import { Children, forwardRef, useRef } from "react";

export default function Input({
    type = "price",
    label = null,
    allowClear = true,
    wrapperClassName = "",
    inputClassName = "",
    className = "",
    children,
    prefix = "",
    ...props
}) {
    const input = useRef(null);

    return (
        <div className={`w-full text-slate-600  ${wrapperClassName}`}>
            <span className="uppercase tracking-wide font-bold text-xs ">
                {label ? label : ""}
            </span>
            <div className={`mt-3 ${className}`}>
                <div className=" border-[#333] border-2 rounded  flex items-center px-3">
                    {prefix}
                    <input
                        className={`text-[#FFF] bg-transparent !ring-0 !border-0 w-full hide-input-increment ${inputClassName}`}
                        ref={input}
                        {...props}
                    />
                    {allowClear ? (
                        <button
                            className="uppercase text-xs opacity-40"
                            onClick={() => {
                                const el = input.current;
                                el.value = "";
                            }}
                        >
                            Clear
                        </button>
                    ) : (
                        ""
                    )}
                </div>
                {children}
            </div>
        </div>
    );
}
