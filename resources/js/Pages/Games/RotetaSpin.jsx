import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Layout from "@/Layouts/Layout";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Transition } from "@headlessui/react";
import { useAlert } from "react-alert";
export default function RotetaSpin({ suitcase, recomended_suitcase }) {
    const alert = useAlert();

    const [state, setState] = useState({
        spin: false,
        status: "open_case",
        connection: false,
        itemwon: [],
        disabled: true,
        showSpinner: false,
    });

    const sellButton = useRef(null);

    var conn = new WebSocket(socket("/roteta?token=" + get_user_token()));

    conn.onmessage = function (res) {
        res = JSON.parse(res.data);

        if (res.error) return alert(res.error);

        if (res.type == "spin" && res.uid) {
            setState((pre) => ({
                ...pre,
                disabled: true,
            }));

            spin(5000, function () {
                const el = document.querySelector(
                    `[data-id="item_${res.uid}"]`
                );
                console.log(`[data-id="item_${res.uid}"]`, el);

                el.scrollIntoView({
                    behavior: "auto",
                    block: "center",
                    inline: "center",
                });
                const product = suitcase.products.find(
                    (product) => product.id == res.uid
                );
                console.log(product);

                setTimeout(() => {
                    setState((pre) => ({
                        ...pre,
                        status: "pop_up",
                        itemwon: product,
                        disabled: false,
                    }));
                }, 1000);
            });
        }

        if (res.type == "sell" && res.sold) {
            alert.show("Sold", { type: "success" });
            setState((pre) => ({
                ...pre,
                status: "open_case",
            }));
        }
    };

    function send_message(props) {
        const msg = JSON.stringify(props);
        conn.send(msg);
    }

    function sell(props) {
        send_message({ type: "sell", id: props.id });
    }

    function spin(time = 5000, callback = function () {}) {
        setState((prev) => ({
            ...prev,
            spin: true,
        }));

        setTimeout(() => {
            setState((prev) => ({
                ...prev,
                spin: false,
            }));
        }, time);

        setTimeout(() => {
            callback();
        }, time + 100);
    }

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            connection: "connecting",
        }));

        conn.onopen = function (e) {
            setState((prev) => ({
                ...prev,
                connected: true,
            }));
            setTimeout(() => {
                setState((prev) => ({
                    ...prev,
                    showSpinner: true,
                    disabled: false,
                    connection: "connected",
                }));
            }, 3000);
        };
    }, []);

    return (
        <Layout>
            <div
                style={{
                    backgroundImage: `url(${url(
                        "/storage/assets/rotetabg.png"
                    )})`,
                    backgroundSize: "cover",
                }}
                className="p-5 backdrop-brightness-50"
            >
                {state.status == "open_case" ? (
                    <>
                        {state.showSpinner ? (
                            <Spinner
                                products={suitcase.products}
                                spin={state.spin}
                            />
                        ) : (
                            <div>
                                <h1 className="text-2xl font-bold text-center">
                                    {suitcase.name}
                                </h1>
                                <img
                                    src={url(suitcase.image_url)}
                                    alt=""
                                    className="mx-auto h-60"
                                />
                            </div>
                        )}
                        {state.connection == "connecting" ? (
                            <span>connecting...</span>
                        ) : (
                            ""
                        )}

                        <div className="flex gap-2 w-full md:max-w-md mx-auto mt-10">
                            <PrimaryButton
                                className="text-black w-full"
                                onClick={() => {
                                    send_message({
                                        type: "spin",
                                        slug: suitcase.slug,
                                    });
                                }}
                                disabled={state.disabled}
                            >
                                Open case
                            </PrimaryButton>

                            <PrimaryButton
                                style={{ background: "black" }}
                                className="w-full border-2 opacity-50 !bg-black border-slate-500 text-white"
                                disabled={state.disabled}
                            >
                                Try for free
                            </PrimaryButton>
                        </div>
                    </>
                ) : state.status == "pop_up" ? (
                    <ShowItem product={state.itemwon}>
                        <div className="flex gap-2 w-full md:max-w-md mx-auto mt-20">
                            <SecondaryButton
                                className="w-full gap-3"
                                onClick={() => {
                                    setState((pre) => ({
                                        ...pre,
                                        status: "open_case",
                                    }));
                                }}
                                disabled={state.disabled}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="18"
                                    viewBox="0 0 16 18"
                                    fill="none"
                                >
                                    <path
                                        d="M8 18C6.88889 18 5.84815 17.7964 4.87778 17.3893C3.90741 16.9821 3.06296 16.4321 2.34444 15.7393C1.62593 15.0464 1.05556 14.2321 0.633333 13.2964C0.211111 12.3607 0 11.3571 0 10.2857H1.77778C1.77778 11.9571 2.38148 13.375 3.58889 14.5393C4.7963 15.7036 6.26667 16.2857 8 16.2857C9.73333 16.2857 11.2037 15.7036 12.4111 14.5393C13.6185 13.375 14.2222 11.9571 14.2222 10.2857C14.2222 8.61429 13.6185 7.19643 12.4111 6.03214C11.2037 4.86786 9.73333 4.28571 8 4.28571H7.86667L9.24444 5.61429L8 6.85714L4.44444 3.42857L8 0L9.24444 1.24286L7.86667 2.57143H8C9.11111 2.57143 10.1519 2.775 11.1222 3.18214C12.0926 3.58929 12.937 4.13929 13.6556 4.83214C14.3741 5.525 14.9444 6.33929 15.3667 7.275C15.7889 8.21071 16 9.21429 16 10.2857C16 11.3571 15.7889 12.3607 15.3667 13.2964C14.9444 14.2321 14.3741 15.0464 13.6556 15.7393C12.937 16.4321 12.0926 16.9821 11.1222 17.3893C10.1519 17.7964 9.11111 18 8 18Z"
                                        fill="#0F0F0F"
                                    />
                                </svg>
                                Open again
                            </SecondaryButton>
                            <PrimaryButton
                                className="w-full gap-3 text-black"
                                disabled={state.disabled}
                                onClick={() => {
                                    sell({
                                        type: "sell",
                                        id: state.itemwon.id,
                                    });
                                }}
                                ref={sellButton}
                                id="sell-btn"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="19"
                                    height="20"
                                    viewBox="0 0 19 20"
                                    fill="none"
                                >
                                    <path
                                        d="M5.722 20C5.23026 20 4.81215 19.8237 4.46766 19.4711C4.12317 19.1186 3.95093 18.6906 3.95093 18.1873C3.95093 17.684 4.12317 17.256 4.46766 16.9034C4.81215 16.5508 5.23026 16.3745 5.722 16.3745C6.21376 16.3745 6.63189 16.5508 6.97638 16.9034C7.32086 17.256 7.49311 17.684 7.49311 18.1873C7.49311 18.6906 7.32086 19.1186 6.97638 19.4711C6.63189 19.8237 6.21376 20 5.722 20ZM15.5312 20C15.0394 20 14.6213 19.8237 14.2768 19.4711C13.9323 19.1186 13.7601 18.6906 13.7601 18.1873C13.7601 17.684 13.9323 17.256 14.2768 16.9034C14.6213 16.5508 15.0394 16.3745 15.5312 16.3745C16.0229 16.3745 16.441 16.5508 16.7855 16.9034C17.13 17.256 17.3023 17.684 17.3023 18.1873C17.3023 18.6906 17.13 19.1186 16.7855 19.4711C16.441 19.8237 16.0229 20 15.5312 20ZM4.5698 3.62548L7.13499 9.12352H14.0345C14.0929 9.12352 14.1448 9.10858 14.1902 9.07869C14.2356 9.04881 14.2746 9.0073 14.307 8.95418L17.022 3.90436C17.061 3.83132 17.0642 3.76658 17.0318 3.71014C16.9993 3.65369 16.9442 3.62546 16.8663 3.62546L4.5698 3.62548ZM3.8419 2.07175H17.8939C18.3078 2.07175 18.6208 2.25202 18.833 2.61257C19.0451 2.97313 19.0552 3.34133 18.8631 3.71716L15.6207 9.72906C15.4546 10.0279 15.235 10.2606 14.9619 10.4273C14.6888 10.5939 14.3894 10.6773 14.0637 10.6773H6.67956L5.5079 12.8685C5.456 12.9482 5.45438 13.0345 5.50305 13.1275C5.55171 13.2205 5.62469 13.267 5.722 13.267H17.3023V14.8207H5.722C5.04732 14.8207 4.54032 14.5229 4.20101 13.9273C3.86171 13.3317 3.84971 12.7371 4.165 12.1434L5.60916 9.48604L1.92681 1.55374H0V0H2.88045L3.8419 2.07172V2.07175Z"
                                        fill="#1B3D16"
                                    />
                                </svg>
                                Sell for {state.itemwon.price}
                            </PrimaryButton>
                        </div>
                    </ShowItem>
                ) : (
                    ""
                )}
            </div>
            <div>
                <h2 className="text-2xl font-bold capitalize">
                    Suitcase content
                </h2>

                <div className="flex flex-wrap gap-2 mt-3">
                    {suitcase.products.map((product) => (
                        <SpinnerItem key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </Layout>
    );
}

function Spinner({ products, spin = false }) {
    return (
        <>
            <div className="relative ">
                <div className="border-[#636363]  border-2 rounded-md flex gap-2 overflow-x-scroll max-w-full hide_scroll_bar">
                    {products.map((product) => (
                        <SpinnerItem
                            spinning={spin}
                            key={product.id}
                            product={product}
                            dummy={true}
                        />
                    ))}
                    {products.map((product) => (
                        <SpinnerItem
                            spinning={spin}
                            key={product.id}
                            product={product}
                        />
                    ))}
                    {products.map((product) => (
                        <SpinnerItem
                            spinning={spin}
                            key={product.id}
                            product={product}
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
function SpinnerItem({ product, spinning = false, dummy = false }) {
    return (
        <div
            className={
                "shadow-sm rounded border-b-2 border-b-blue-950 item-bg-gradiant h-64 w-[180px] flex flex-col items-center flex-shrink-0  " +
                (spinning ? "animate-scroll-left" : "")
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

function ShowItem({ product, children }) {
    return (
        <>
            <div className="relative p-5">
                <div className="relative z-10">
                    <div className="mx-auto w-fit">
                        <img src={url(product.image_url)} alt="" />
                    </div>

                    <div className="w-fit mx-auto text-[#FFC664] text-2xl mt-10 font-bold">
                        {product.name}
                    </div>

                    {children}
                </div>
                <div className=" top-0 flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="741"
                        height="283"
                        viewBox="0 0 741 283"
                        fill="none"
                        className="absolute  top-0 left-1/2 transform -translate-x-1/2 "
                    >
                        <g opacity="0.2" filter="url(#filter0_f_153_7028)">
                            <path
                                d="M92.018 197.661L105.351 147.724C89.2418 145.725 83.1665 137.377 87.088 122.681L97.0849 85.1918H122.033L112.024 122.681C111.115 126.08 111.551 129.005 113.344 131.454C115.124 133.903 117.713 135.128 121.1 135.128C124.486 135.128 127.872 133.903 130.972 131.454C134.072 129.005 136.064 126.08 136.973 122.681L146.982 85.1918H171.781L161.772 122.681C157.85 137.377 147.355 145.725 130.287 147.724L116.954 197.661H92.018Z"
                                fill="#D1992F"
                            />
                            <path
                                d="M206.739 85.1918H231.687C238.46 85.1918 243.626 87.6661 247.187 92.6147C250.747 97.5633 251.619 103.437 249.801 110.235L233.144 172.618C231.326 179.416 227.318 185.289 221.118 190.238C214.918 195.186 208.432 197.661 201.66 197.661H176.711C169.939 197.661 164.747 195.211 161.124 190.313C157.502 185.414 156.618 179.516 158.448 172.618L175.105 110.235C176.948 103.337 180.981 97.4384 187.218 92.5397C193.455 87.6411 199.954 85.1918 206.739 85.1918ZM200.054 110.235L183.396 172.618C182.488 176.017 182.923 178.966 184.691 181.465C186.459 183.964 189.048 185.214 192.435 185.214C195.821 185.214 199.219 183.964 202.319 181.465C205.432 178.966 207.436 176.017 208.345 172.618L225.002 110.235C225.936 106.736 225.513 103.762 223.72 101.312C221.927 98.863 219.3 97.6383 215.814 97.6383C212.329 97.6383 209.191 98.863 206.092 101.312C202.992 103.762 200.987 106.736 200.054 110.235Z"
                                fill="#D1992F"
                            />
                            <path
                                d="M316.393 85.1918H341.192L317.849 172.618C316.032 179.416 312.023 185.289 305.823 190.238C299.624 195.186 293.137 197.661 286.365 197.661H261.417C254.644 197.661 249.453 195.211 245.83 190.313C242.207 185.414 241.323 179.516 243.153 172.618L266.496 85.1918H291.444L268.102 172.618C267.193 176.017 267.629 178.966 269.397 181.465C271.164 183.964 273.754 185.214 277.14 185.214C280.526 185.214 283.925 183.964 287.025 181.465C290.137 178.966 292.142 176.017 293.05 172.618L316.393 85.1918Z"
                                fill="#D1992F"
                            />
                            <path
                                d="M373.61 85.1918H398.559L371.855 185.214H384.254C387.74 185.214 391.039 183.964 394.139 181.465C397.251 178.966 399.256 176.017 400.165 172.618L423.507 85.1918H448.306L421.603 185.214H434.151C437.538 185.214 440.787 183.964 443.887 181.465C446.999 178.966 449.004 176.017 449.912 172.618L473.255 85.1918H498.203L479.592 154.922C476.467 166.619 469.632 176.666 459.075 185.064C448.518 193.462 437.363 197.661 425.611 197.661H393.492L394.538 193.762C389.06 196.361 382.835 197.661 375.863 197.661H343.595L373.61 85.1918Z"
                                fill="#D1992F"
                            />
                            <path
                                d="M490.597 197.661L520.612 85.1918H545.411L515.384 197.661H490.584H490.597Z"
                                fill="#D1992F"
                            />
                            <path
                                d="M537.805 197.661L567.82 85.1918H573.647L625.822 147.724L642.516 85.1918H655.065L625.038 197.661H619.361L567.036 135.128L550.341 197.661H537.792H537.805Z"
                                fill="#D1992F"
                            />
                        </g>
                        <defs>
                            <filter
                                id="filter0_f_153_7028"
                                x="0.93457"
                                y="0.191772"
                                width="739.131"
                                height="282.469"
                                filterUnits="userSpaceOnUse"
                                color-interpolation-filters="sRGB"
                            >
                                <feFlood
                                    flood-opacity="0"
                                    result="BackgroundImageFix"
                                />
                                <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="BackgroundImageFix"
                                    result="shape"
                                />
                                <feGaussianBlur
                                    stdDeviation="42.5"
                                    result="effect1_foregroundBlur_153_7028"
                                />
                            </filter>
                        </defs>
                    </svg>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="589"
                        height="127"
                        viewBox="0 0 589 127"
                        fill="none"
                        className=" absolute  top-14 left-1/2 transform -translate-x-1/2 "
                    >
                        <g filter="url(#filter0_d_153_7027)">
                            <path
                                d="M263.461 7.3136H240.394L216.931 95.5038L216.931 95.5041C215.948 99.1923 213.783 102.366 210.486 105.024C207.189 107.691 203.527 109.06 199.837 109.06C196.12 109.06 193.172 107.663 191.171 104.823C189.182 102.002 188.725 98.6868 189.709 94.9896C189.709 94.9895 189.709 94.9894 189.71 94.9893L213.036 7.3136H189.817L166.354 95.5023L263.461 7.3136ZM263.461 7.3136L240.135 94.9893C240.135 94.9894 240.135 94.9895 240.135 94.9896C238.354 101.673 234.426 107.472 228.286 112.39C222.147 117.308 215.787 119.722 209.188 119.722H183.899C177.313 119.722 172.367 117.351 168.905 112.654C165.446 107.959 164.561 102.285 166.354 95.5038L263.461 7.3136ZM13.4931 119.722L26.6736 70.1815L26.9683 69.0738L25.8308 68.9321C17.7881 67.9303 12.4948 65.3646 9.64623 61.4426C6.81069 57.5386 6.21352 52.0325 8.16149 44.7065L8.16154 44.7064L18.0971 7.3136H41.3159L31.5047 44.1921C30.5204 47.8866 30.9749 51.1838 32.9992 53.9606C35.016 56.7449 37.9612 58.1107 41.6703 58.1107C45.3555 58.1107 49.0022 56.7707 52.2985 54.1569C55.5896 51.5473 57.7431 48.3956 58.7258 44.707L58.7259 44.7067L68.674 7.3136H91.7415L81.9303 44.1925L81.9302 44.1926C79.9899 51.4897 76.4423 57.1544 71.3132 61.2487C66.1758 65.3496 59.3825 67.9301 50.8664 68.9312L50.1915 69.0106L50.0167 69.6673L36.6994 119.722H13.4931ZM171.16 31.531L171.159 31.5313L154.275 94.9893C154.275 94.9894 154.275 94.9895 154.275 94.9896C152.494 101.673 148.566 107.472 142.426 112.39C136.287 117.308 129.928 119.722 123.328 119.722H98.0395C91.4528 119.722 86.5068 117.351 83.0455 112.654C79.5859 107.959 78.7012 102.285 80.4942 95.5023L97.378 32.0456C97.378 32.0456 97.378 32.0456 97.378 32.0456C99.1841 25.2598 103.138 19.4378 109.309 14.5736C115.486 9.70453 121.861 7.3136 128.477 7.3136H153.765C160.348 7.3136 165.264 9.70649 168.663 14.4472C172.07 19.1988 172.938 24.8544 171.16 31.531ZM131.071 95.5041L131.071 95.5038L147.955 32.0456L147.955 32.0454C148.962 28.259 148.528 24.9073 146.497 22.1228C144.463 19.3339 141.477 17.9747 137.676 17.9747C133.877 17.9747 130.483 19.3242 127.199 21.9285C123.902 24.5426 121.74 27.7471 120.734 31.5315L103.85 94.9893C103.85 94.9894 103.85 94.9895 103.85 94.9896C102.865 98.6868 103.323 102.002 105.311 104.823C107.312 107.663 110.261 109.06 113.977 109.06C117.667 109.06 121.329 107.691 124.626 105.024C127.923 102.366 130.088 99.1923 131.071 95.5041ZM308.411 109.06C312.205 109.06 315.765 107.689 319.058 105.025C322.357 102.367 324.522 99.1928 325.505 95.5041L325.505 95.5038L348.968 7.3136H372.035L345.302 107.803L344.968 109.06H346.268H358.988C362.688 109.06 366.197 107.685 369.484 105.025C372.782 102.367 374.948 99.1928 375.93 95.5041L375.931 95.5038L399.394 7.3136H422.613L404.082 76.9895C400.975 88.6579 394.181 98.7019 383.628 107.126C373.076 115.55 361.984 119.722 350.332 119.722H319.077L319.801 117.014L320.36 114.921L318.405 115.853C313.005 118.424 306.846 119.722 299.906 119.722H268.498L298.391 7.3136H321.61L294.876 107.803L294.542 109.06H295.843H308.411ZM447.396 7.3136H470.464L440.559 119.722H417.504L447.396 7.3136ZM475.993 119.722H465.355L495.248 7.3136H499.916L552.502 70.5637L553.74 72.0523L554.237 70.1815L570.962 7.3136H581.612L551.707 119.722H547.19L494.452 56.4703L493.215 54.986L492.718 56.8536L475.993 119.722Z"
                                stroke="url(#paint0_linear_153_7027)"
                                stroke-width="2"
                                shape-rendering="crispEdges"
                            />
                        </g>
                        <defs>
                            <filter
                                id="filter0_d_153_7027"
                                x="0.0258789"
                                y="0.313599"
                                width="588.887"
                                height="126.408"
                                filterUnits="userSpaceOnUse"
                                color-interpolation-filters="sRGB"
                            >
                                <feFlood
                                    flood-opacity="0"
                                    result="BackgroundImageFix"
                                />
                                <feColorMatrix
                                    in="SourceAlpha"
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha"
                                />
                                <feOffset />
                                <feGaussianBlur stdDeviation="3" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix
                                    type="matrix"
                                    values="0 0 0 0 0.921569 0 0 0 0 0.415686 0 0 0 0 0.180392 0 0 0 0.6 0"
                                />
                                <feBlend
                                    mode="normal"
                                    in2="BackgroundImageFix"
                                    result="effect1_dropShadow_153_7027"
                                />
                                <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect1_dropShadow_153_7027"
                                    result="shape"
                                />
                            </filter>
                            <linearGradient
                                id="paint0_linear_153_7027"
                                x1="18.1454"
                                y1="6.31363"
                                x2="543.646"
                                y2="120.722"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#EBA92E" />
                                <stop
                                    offset="0.538404"
                                    stop-color="#EBA92E"
                                    stop-opacity="0"
                                />
                                <stop offset="1" stop-color="#EBA92E" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
        </>
    );
}

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
