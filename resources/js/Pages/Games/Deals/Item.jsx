import { url } from "@/Libs/urls";
import { forwardRef } from "react";

export default forwardRef(function Item(
    { isSelected = false, product, className, ...props },
    ref
) {
    return (
        <div
            className={`shadow-sm cursor-pointer rounded border-b-2 border-b-blue-950 item-bg-gradiant h-56 break-inside-avoid-column flex flex-col items-center flex-shrink-0 ${className} ${
                isSelected && "opacity-30"
            }`}
            {...props}
            ref={ref}
            tabIndex="-1"
        >
            <div className="p-5 pt-10 ">
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
