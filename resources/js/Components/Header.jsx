import BottleIcon from "@/Components/Icons/BottleIcon";
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
import { url } from "@/Libs/urls.js";
import axios from "axios";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
   
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export default function Header({ user }) {
    const {
        balance,
        updating_balance,
        addBalace,
        updateBalance,
        games,
        setGames,
    } = useStore((state) => state);

    const avatar = user?.avatar;

    const fetchGames = async () => {
        try {
            let response = await axios.post(route("games.all"));

            setGames(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (balance == 0) updateBalance();
        if (!games.length) fetchGames();
    }, []);

    return (
        <nav className="max-content-width  flex items-center p-5 lg:p-10  text-[#959595] text-sm">
            <MobileMenu
                balance={balance}
                updating_balance={updating_balance}
                addBalace={addBalace}
                updateBalance={updateBalance}
                games={games}
            />

            <Link href={url("/")}>
                <ApplicationLogo className="h-6 lg:h-8   " />
            </Link>

            <div className="ml-5 flex items-center gap-3 divide-x divide-slate-400">
                <div className="hidden lg:flex items-center gap-3 font-medium">
                    <RssIcon className="h-3 w-3" />
                    <span className="text-[#6FCAE8] ">2.207</span>
                </div>

                <div className="hidden lg:flex items-center gap-8  uppercase px-4">
                    <DropdownMenu className="block">
                        <DropdownMenuTrigger
                            disabled={!games.length}
                            className="flex  items-center gap-3 hover-underline-animation border-0 ring-0 outline-none"
                        >
                            <GamePadIcon className="-mt-1 h-6 w-6" />
                            <div className="flex items-center gap-2 uppercase">
                                Games
                                <svg
                                    width={6}
                                    height={5}
                                    viewBox="0 0 6 5"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 0.5L3 4.5L0 0.5H6Z"
                                        fill="#959595"
                                    />
                                </svg>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-0 mt-5 ml-5">
                            {games.map((game) => (
                                <DropdownMenuItem key={game.id}>
                                    <Link
                                        href={`/games/${game.name.toLowerCase()}`}
                                        className="capitalize"
                                    >
                                        {game.name}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

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

            <div className="flex items-center gap-2 lg:gap-5 ml-auto">
                <button>
                    <NotificationIcon className="-mt-2 h-8 w-8" active={true} />
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

                <Link href={route("my.items")}>
                    <FrameIcon className="hidden lg:block h-6 w-6" />
                </Link>

                <Link
                    href={route("profile.edit")}
                    className="block rounded-full ml-3 lg:ml-0 overflow-hidden h-8 w-8 lg:h-10 lg:w-10 bg-slate-800"
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
            </div>
        </nav>
    );
}
