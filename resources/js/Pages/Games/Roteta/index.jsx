import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Spinner from "./Spinner";
import ShowItem from "./ShowItem";
import SpinnerItem from "./SpinnerItem";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useStore } from "@/Store/main";
import { useToast } from "@/Components/ui/use-toast";
import { url, socket } from "@/Libs/urls";
import GameLayout from "@/Layouts/GameLayout";
import Suitcase from "@/Components/Suitcase";
import { Link } from "@inertiajs/react";
import { clickSound, successSound, errorSound } from "@/Libs/sounds";

export default function RotetaSpin({ suitcase, recomended_suitcase }) {
    const { toast } = useToast();

    const { updateBalance, settings } = useStore((state) => state);
    const [state, setState] = useState({
        spin: false,
        status: "open_case",
        connection: null,
        itemwon: [],
        disabled: true,
        showSpinner: false,
    });

    const showError = (description) => {
        toast({
            title: "Error",
            description: description,
            variant: "destructive",
        });
        settings.sound && errorSound();
    };

    const showInfo = (description) => {
        toast({
            title: "Info",
            description: description,
        });
        settings.sound && errorSound();
    };
    const sellButton = useRef(null);

    const connRef = useRef(null);

    const handleMessage = function (res) {
        res = JSON.parse(res.data);

        if (res.error) return showError(res.error);
        //spin
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

                setTimeout(() => {
                    setState((pre) => ({
                        ...pre,
                        status: "pop_up",
                        itemwon: product,
                        disabled: false,
                    }));
                    settings.sound && successSound();
                }, 1000);
            });
        }
        //sell
        if (res.type == "sell" && res.sold) {
            toast({
                title: "Item Sold",
                description: "Item is sold and money added to your wallet",
            });
            console.log(res.balance);
            updateBalance(res.balance);
            settings.sound && successSound();
            setState((pre) => ({
                ...pre,
                status: "open_case",
            }));
        }
    };

    const send_message = (props) => {
        const msg = JSON.stringify(props);
        connRef.current.send(msg);
        settings.sound && clickSound();
    };

    const sell = (props) => {
        send_message({ type: "sell", id: props.id });
    };

    const spin = (time = 5000, callback = function () {}) => {
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
    };

    useEffect(() => {
        if (connRef.current) return;

        var conn = new WebSocket(socket("/roteta?token=" + get_user_token()));

        conn.onmessage = handleMessage;

        conn.onopen = function (e) {
            setTimeout(() => {
                setState((prev) => ({
                    ...prev,
                    showSpinner: true,
                    disabled: false,
                    connection: true,
                }));
            }, 3000);
        };

        conn.onclose = () => {
            setState((prev) => ({
                ...prev,
                connected: false,
            }));
        };
        connRef.current = conn;

        return () => {
            connRef.current.close();
        };
    }, []);

    return (
        <GameLayout title="Roleta">
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
                                {state.connection === null
                                    ? "connecting..."
                                    : state.connection === false
                                    ? "connection failed"
                                    : "Open case"}
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
                                className="w-full gap-3 text-white"
                                onClick={() => {
                                    setState((pre) => ({
                                        ...pre,
                                        status: "open_case",
                                    }));

                                    settings.sound && clickSound();
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
                                        fill="white"
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

                                    settings.sound && clickSound();
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

                <div className="columns-2 md:columns-4  lg:columns-5  mt-3 ">
                    {suitcase.products.map((product) => (
                        <SpinnerItem key={product.id} product={product} />
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold capitalize mt-5">
                        Recomended Suitcases
                    </h2>
                    <Link
                        href={route("suitcases.paginate")}
                        className="text-slate-700 uppercase ml-auto gap-3 flex items-center"
                    >
                        <svg
                            width={9}
                            height={9}
                            viewBox="0 0 9 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                width={3}
                                height={3}
                                rx="1.5"
                                fill="#3F3F3F"
                            />
                            <rect
                                y={6}
                                width={3}
                                height={3}
                                rx="1.5"
                                fill="#3F3F3F"
                            />
                            <rect
                                x={6}
                                width={3}
                                height={3}
                                rx="1.5"
                                fill="#3F3F3F"
                            />
                            <rect
                                x={6}
                                y={6}
                                width={3}
                                height={3}
                                rx="1.5"
                                fill="#3F3F3F"
                            />
                        </svg>
                        SEE ALL CASES
                    </Link>
                </div>

                <div className="columns-2 md:columns-4  lg:columns-5  mt-5 ">
                    {recomended_suitcase.map((suitcase) => (
                        <Suitcase data={suitcase} key={suitcase.id} />
                    ))}
                </div>
            </div>
        </GameLayout>
    );
}
