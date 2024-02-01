import BottleIcon from "@/Components/Icons/BottleIcon";
import CartIcon from "@/Components/Icons/CartIcon";
import FrameIcon from "@/Components/Icons/FrameIcon";
import GamePadIcon from "@/Components/Icons/GamePadIcon";
import GiftIcon from "@/Components/Icons/GiftIcon";
import NotificationIcon from "@/Components/Icons/NotificationIcon";
import RssIcon from "@/Components/Icons/RssIcon";
import UsersIcon from "@/Components/Icons/UsersIcon";
import MobileMenu from "@/Components/MobileMenu";
import PrimaryButton from "@/Components/PrimaryButton";
import { Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { useStore } from "@/Store/main";
import Carts from "./Carts";

export default function Header({ user }) {
    const balance = useStore((state) => state.balance);
    const updating_balance = useStore((state) => state.updating_balance);
    const updateBalance = useStore((state) => state.updateBalance);
    const addBalace = useStore((state) => state.addBalace);

    const [state, setState] = useState({
        showMobileMenu: false,
        showNotificationBox: false,
    });

    const avatar = user?.avatar;

    const [tab, setTab] = useState(false);

    const changeAuthTab = (tab) => {
        if (!user) return router.visit(route("login"));
        setTab(tab);
    };

    useEffect(() => {
        if (balance == 0) {
            updateBalance();
        }
    }, []);

    return (
        <nav className="flex items-center p-5 lg:p-10 gap-5  text-[#959595] text-sm">
            <button
                className={`lg:hidden ${state.showMobileMenu ? "ring-2" : ""}`}
                onClick={() => {
                    setTab("menu");
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </button>

            <Link href={url("/")}>
                <ApplicationLogo />
            </Link>

            <div className="flex items-center gap-3 divide-x divide-slate-400">
                <div className="hidden lg:flex items-center gap-3 font-medium">
                    <RssIcon className="h-3 w-3" />
                    <span className="text-[#6FCAE8] ">2.207</span>
                </div>

                <div className="hidden lg:flex items-center gap-8  uppercase px-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 hover-underline-animation "
                    >
                        <GamePadIcon className="-mt-1 h-6 w-6" />
                        Games
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center gap-3 hover-underline-animation"
                    >
                        <UsersIcon className="-mt-1 h-6 w-6" />
                        Affiliated
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center gap-3 hover-underline-animation"
                    >
                        <GiftIcon className="-mt-1 h-6 w-6" />
                        Rewards
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-5 ml-auto">
                <button>
                    <NotificationIcon className="-mt-2 h-8 w-8" active={true} />
                </button>

                <button
                    onClick={() => {
                        changeAuthTab("my cart");
                    }}
                >
                    <CartIcon className="h-5 w-5 " />
                </button>

                <div className="hidden lg:flex gap-5 items-center justify-center font-bold bg-[#141414] rounded-md p-2">
                    <div className="flex gap-3 items-center">
                        <span className="text-[#5AC35D]">€</span>{" "}
                        {updating_balance ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 animate-bounce -mb-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        ) : (
                            balance
                        )}
                    </div>

                    <PrimaryButton
                        className="py-2 text-black"
                        onClick={() => addBalace(200)}
                    >
                        Deposit
                    </PrimaryButton>

                    <span className="flex gap-3 items-center">
                        <BottleIcon width="14" height="21" /> 3
                    </span>
                </div>

                <FrameIcon className="hidden lg:block h-6 w-6" />

                <Link
                    href={route("profile.edit")}
                    className="block rounded-full overflow-hidden h-10 w-10 bg-slate-800"
                >
                    <img
                        src={
                            avatar
                                ? url("/storage/avatars/" + avatar)
                                : url("/assets/avatars/seccao.png")
                        }
                        alt=""
                        className="object-contain h-full"
                    />
                </Link>

                {tab ? (
                    <>
                        <div
                            onClick={() => {
                                setTab(false);
                            }}
                            className="bg-black opacity-75 fixed top-0 left-0 right-0 bottom-0 z-50 w-full h-full"
                        ></div>

                        <div className="side-menu h-full w-full  max-w-lg overflow-y-auto fixed  top-0 bottom-0 right-0 z-50 bg px-5 py-3  border-[#1B1B1B] border-2 rounded-md">
                            <div className="flex items-center gap-5 py-3 border-b border-b-slate-900">
                                <button
                                    className="my-3"
                                    onClick={() => {
                                        setTab(false);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18 18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                                <h2 className="font-semibold text-lg capitalize">
                                    {tab}
                                </h2>
                            </div>
                            {tab == "my cart" ? (
                                <Carts carts={user.carts} />
                            ) : (
                                ""
                            )}
                            {tab == "menu" ? (
                                <MobileMenu
                                    open={true}
                                    balance={balance}
                                    updating_balance={updating_balance}
                                    updateBalance={updateBalance}
                                    addBalace={addBalace}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </>
                ) : (
                    ""
                )}
            </div>
        </nav>
    );
}
