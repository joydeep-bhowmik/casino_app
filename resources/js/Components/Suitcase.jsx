import { url } from "@/Libs/urls";
import { Link } from "@inertiajs/react";
import Markdown from "react-markdown";

export default function Suitcase({ className, data, ...props }) {
    const percentoff =
        (data.compare_at_price ? data.price - data.compare_at_price : 0) / 100;
    return (
        <Link
            href={route("games.roteta", data.slug)}
            className={`relative bg-[#141414] rounded-sm block   w-full break-inside-avoid-column ${className}`}
        >
            {data.flag ? (
                <div className="absolute top-3 left-3 text-green-700 uppercase flex items-center gap-2 text-xs">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                    {data.flag}
                </div>
            ) : (
                ""
            )}

            <div className="h-36 w-36 mx-auto">
                <img
                    src={url(data.image_url)}
                    alt=""
                    className="object-contain h-full mx-auto"
                />
            </div>
            <div className="space-y-2 p-3">
                <div>
                    <h2 className="text-lg text-white font-bold break-words truncate">
                        {data.name}
                    </h2>
                    <div className="text-slate-500 truncate text-xs">
                        <Markdown>{data.description}</Markdown>{" "}
                    </div>
                </div>

                <div className="font-semibold text-sm">
                    € {data.price}{" "}
                    {percentoff ? (
                        <span
                            className={`px-2 py-0.5 text-xs ml-3 font-light ${
                                percentoff > 0 ? "bg-red-500 " : "bg-green-700"
                            }`}
                        >
                            {Math.floor((percentoff * 100).toFixed(1))} %
                        </span>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </Link>
    );
}
