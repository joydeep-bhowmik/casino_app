import { forwardRef, useEffect, useMemo, useRef } from "react";

export function SpinItems({
    items,
    spin = false,
    duration = 5000,
    targetId = null,
    ItemComponent,
    minDummiesLength = 14,
    className,
    ...props
}) {
    const target = useRef(null);

    const length = items.length;

    let dummiesLength = 0;

    if (items.length < minDummiesLength) {
        dummiesLength = minDummiesLength;
    }

    const dummies = useMemo(() => {
        let dummies = [];

        for (let i = 0; i < dummiesLength; i++) {
            let randomIndex = Math.floor(Math.random() * items.length);

            dummies.push(items[randomIndex]);
        }
        return dummies;
    }, []);

    useEffect(() => {
        if (!spin && targetId != null) {
            target.current.scrollIntoView({
                behavior: "auto",
                block: "center",
                inline: "center",
            });
        }
    }, [targetId]);
    return (
        <>
            <div className={`relative  ${className}`} {...props}>
                <div className="border-[#636363] h-full items-center border-2 rounded-md flex gap-2 overflow-x-scroll max-w-full hide_scroll_bar">
                    {dummies.map((item, i) => (
                        <ItemComponent
                            spinning={spin}
                            key={i}
                            item={item}
                            dummy={true}
                        />
                    ))}
                    {items.map((item, i) => (
                        <ItemComponent
                            spinning={spin}
                            key={i}
                            item={item}
                            ref={item.id == targetId ? target : null}
                        />
                    ))}
                    {dummies.map((item, i) => (
                        <ItemComponent
                            spinning={spin}
                            key={i}
                            item={item}
                            dummy={true}
                        />
                    ))}
                </div>

                <span className="absolute -bottom-11 left-0 right-0 w-fit mx-auto ">
                    <ArrowUp />
                </span>
                <span className="absolute -top-8 left-0 right-0 w-fit mx-auto ">
                    <ArrowDown />
                </span>
            </div>
        </>
    );
}

const Item = forwardRef(function (
    { item, spinning = false, dummy = false },
    ref
) {
    return (
        <div
            className={
                "shadow-sm rounded border-b-2 border-b-blue-950 item-bg-gradiant h-64 w-[180px] flex flex-col items-center flex-shrink-0  " +
                " " +
                (spinning ? " animate-scroll-left" : "")
            }
            ref={ref}
        >
            <div className="p-5 pt-10 h-36">
                <img
                    src={url(item.image_url)}
                    alt=""
                    className="object-contain w-full"
                />
            </div>
        </div>
    );
});
function ArrowDown() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="86"
            height="80"
            viewBox="0 0 86 80"
            fill="none"
        >
            <g filter="url(#filter0_ddd_153_3189)">
                <path
                    d="M53.1315 21C53.9302 21 54.4066 21.8901 53.9635 22.5547L43.8321 37.7519C43.4362 38.3457 42.5638 38.3457 42.1679 37.7519L32.0365 22.5547C31.5934 21.8901 32.0698 21 32.8685 21H53.1315Z"
                    fill="url(#paint0_linear_153_3189)"
                />
                <path
                    d="M54.3796 22.8321C55.0441 21.8352 54.3295 20.5 53.1315 20.5H32.8685C31.6705 20.5 30.9559 21.8352 31.6204 22.8321L41.7519 38.0293C42.3457 38.9199 43.6543 38.9199 44.2481 38.0293L54.3796 22.8321Z"
                    stroke="white"
                />
            </g>
            <defs>
                <filter
                    id="filter0_ddd_153_3189"
                    x="0.865234"
                    y="0"
                    width="84.2695"
                    height="79.1973"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="10" />
                    <feGaussianBlur stdDeviation="15" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_153_3189"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="-1" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="effect1_dropShadow_153_3189"
                        result="effect2_dropShadow_153_3189"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="10" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="effect2_dropShadow_153_3189"
                        result="effect3_dropShadow_153_3189"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect3_dropShadow_153_3189"
                        result="shape"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_153_3189"
                    x1="43"
                    y1="21"
                    x2="45.2583"
                    y2="38.7121"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#3D3D3D" />
                    <stop offset="1" stopColor="white" />
                </linearGradient>
            </defs>
        </svg>
    );
}

function ArrowUp() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="78"
            height="74"
            viewBox="0 0 78 74"
            fill="none"
        >
            <g filter="url(#filter0_ddd_153_3190)">
                <path
                    d="M32 33C31.176 33 30.7056 32.0592 31.2 31.4L38.2 22.0667C38.6 21.5333 39.4 21.5333 39.8 22.0667L46.8 31.4C47.2944 32.0592 46.824 33 46 33L32 33Z"
                    fill="url(#paint0_linear_153_3190)"
                />
                <path
                    d="M30.8 31.1C30.0584 32.0889 30.7639 33.5 32 33.5L46 33.5C47.2361 33.5 47.9416 32.0889 47.2 31.1L40.2 21.7667C39.6 20.9667 38.4 20.9667 37.8 21.7667L30.8 31.1Z"
                    stroke="white"
                />
            </g>
            <defs>
                <filter
                    id="filter0_ddd_153_3190"
                    x="-0.00341797"
                    y="0.666626"
                    width="78.0068"
                    height="73.3334"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="10" />
                    <feGaussianBlur stdDeviation="15" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_153_3190"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="-1" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="effect1_dropShadow_153_3190"
                        result="effect2_dropShadow_153_3190"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="10" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="effect2_dropShadow_153_3190"
                        result="effect3_dropShadow_153_3190"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect3_dropShadow_153_3190"
                        result="shape"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_153_3190"
                    x1="39"
                    y1="33"
                    x2="37.6572"
                    y2="21.1522"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#3D3D3D" />
                    <stop offset="1" stopColor="white" />
                </linearGradient>
            </defs>
        </svg>
    );
}
