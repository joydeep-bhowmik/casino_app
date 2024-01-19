import ApplicationLogo from "@/Components/ApplicationLogo";
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
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { usePage } from "@inertiajs/react";

export default function Layout({ children, ...props }) {
    const [state, setState] = useState({
        showMobileMenu: false,
        showNotificationBox: false,
    });
    const { pages, socials } = usePage().props.data;

    console.log(pages);

    return (
        <div className=" min-h-screen">
            <nav className="flex items-center p-5 lg:p-10 gap-5  text-[#959595] text-sm">
                <ApplicationLogo />

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
                        <NotificationIcon
                            className="-mt-2 h-8 w-8"
                            active={true}
                        />
                    </button>

                    <Link href="/">
                        <CartIcon className="h-5 w-5 " />
                    </Link>

                    <div className="hidden lg:flex gap-5 items-center justify-center font-bold bg-[#141414] rounded-md p-2">
                        <div className="flex gap-3 items-center">
                            <span className="text-[#5AC35D]">€</span> 0.00
                        </div>

                        <Link href="/" className="text-black">
                            <PrimaryButton className="py-2">
                                Deposit
                            </PrimaryButton>
                        </Link>

                        <span className="flex gap-3 items-center">
                            <BottleIcon width="14" height="21" /> 3
                        </span>
                    </div>

                    <FrameIcon className="hidden lg:block h-6 w-6" />

                    <button
                        htmlFor="menu-check"
                        className={
                            "block rounded-full overflow-hidden h-10 w-10 bg-slate-800" +
                            " " +
                            (state.showMobileMenu ? "ring-4" : "")
                        }
                        onClick={() =>
                            setState({
                                ...state,
                                showMobileMenu: !state.showMobileMenu,
                            })
                        }
                    >
                        <img
                            src={url("/assets/avatars/seccao.png")}
                            alt=""
                            className="object-contain h-full"
                        />
                    </button>

                    {/* mobile nav */}

                    <MobileMenu open={state.showMobileMenu} />
                </div>
            </nav>

            <main className="min-h-screen">{children}</main>

            <footer className="bg mt-10">
                <div className="border-b border-[#292929] flex flex-col gap-8 md:grid md:grid-cols-[auto_auto_auto] p-8">
                    <div className="flex  gap-5">
                        {socials.map((s) => (
                            <a href={s.link} key={s.id} target="_blank">
                                <img
                                    src={s.image_url}
                                    alt=""
                                    className="h-6 w-6"
                                />
                            </a>
                        ))}
                    </div>
                    <div className="flex lg:flex-row flex-col gap-8  break-inside-avoid-column">
                        {pages.map((p) => (
                            <Link
                                href={p.slug}
                                key={p.slug}
                                className="uppercase"
                            >
                                {p.title}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex md:gap-28 md:flex-row flex-col gap-8 items-center p-8">
                    <ApplicationLogo />

                    <p>
                        Copyright © {new Date().getFullYear()}{" "}
                        {window.location.host}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
