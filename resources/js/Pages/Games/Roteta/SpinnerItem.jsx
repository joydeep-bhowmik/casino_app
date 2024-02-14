import { url } from "@/Libs/urls";
export default function SpinnerItem({
    product,
    spinning = false,
    dummy = false,
    className,
}) {
    return (
        <div
            className={
                "shadow-sm break-inside-avoid-column rounded border-b-2 border-b-blue-950 item-bg-gradiant h-64 flex flex-col items-center flex-shrink-0  " +
                (spinning ? "animate-scroll-left" : "") +
                " " +
                className
            }
            data-id={dummy ? " " : "item_" + product.id}
        >
            <div className="p-5 pt-10 h-36">
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
}
