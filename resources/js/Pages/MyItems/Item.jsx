import { url } from "@/Libs/urls";
import { forwardRef } from "react";

export default forwardRef(function Item(
    { isSelected = false, product, className, ...props },
    ref
) {
    return (
        <div
            className={`relative shadow-sm border-2 border-transparent cursor-pointer rounded item-bg-gradiant h-56 break-inside-avoid-column flex flex-col items-center flex-shrink-0 ${className} ${
                isSelected
                    ? "!border-[#214CD0] "
                    : "border-b-2 border-b-blue-950 "
            }`}
            {...props}
            ref={ref}
            tabIndex="-1"
            disabled={isSelected}
        >
            {isSelected ? (
                <div className="absolute top-2 left-2">
                    <Tick />
                </div>
            ) : (
                ""
            )}
            <div className="p-5 pt-10 max-h-16">
                <img
                    src={url(product.image_url)}
                    alt=""
                    className="object-contain w-full"
                />
            </div>
            <div className="mt-auto text-center p-5 ">
                <div className="font-[700] w-fit">{product.name}</div>

                <span className="uppercase text-xs w-fit">PORSHE</span>
            </div>
        </div>
    );
});
function Tick(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="29"
            height="29"
            fill="none"
            viewBox="0 0 29 29"
            {...props}
        >
            <path
                stroke="#214CD0"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M14.499 26.582c3.337 0 6.357-1.352 8.544-3.539a12.045 12.045 0 003.54-8.544c0-3.337-1.353-6.358-3.54-8.544a12.045 12.045 0 00-8.544-3.54 12.046 12.046 0 00-8.544 3.54 12.046 12.046 0 00-3.54 8.544c0 3.337 1.353 6.357 3.54 8.544a12.046 12.046 0 008.544 3.54z"
            ></path>
            <path
                stroke="#214CD0"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.666 14.5l3.624 3.625 7.25-7.25"
            ></path>
        </svg>
    );
}
