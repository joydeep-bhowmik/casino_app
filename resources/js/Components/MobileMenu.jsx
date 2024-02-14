import React from "react";
import PrimaryButton from "./PrimaryButton";
import GiftIcon from "./Icons/GiftIcon";
import UsersIcon from "./Icons/UsersIcon";
import BottleIcon from "./Icons/BottleIcon";
import GamePadIcon from "./Icons/GamePadIcon";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";

export default function MobileMenu({
    balance,
    updating_balance,
    addBalace,
    updateBalance,
    games,
}) {
    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-white lg:hidden"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </SheetTrigger>
                <SheetContent side="left" className="border-0">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-5 mt-5">
                        <div className="flex gap-5 items-center justify-center font-bold bg-[#141414] rounded-md p-2">
                            <div className="flex gap-3 items-center">
                                <span className="text-[#5AC35D]">€</span>

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

                            <a href="http://" className="text-black">
                                <PrimaryButton
                                    className="py-2"
                                    onClick={() => addBalace(200)}
                                >
                                    Deposit
                                </PrimaryButton>
                            </a>

                            <span className="flex gap-3 items-center">
                                <BottleIcon width="14" height="21" /> 3
                            </span>
                        </div>

                        <div className="uppercase px-4 space-y-5">
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

                            <Link className="flex items-center gap-3 hover-underline-animation">
                                <UsersIcon className="-mt-1 h-6 w-6" />
                                AFFILIATED
                            </Link>

                            <Link className="flex items-center gap-3 hover-underline-animation">
                                <GiftIcon className="-mt-1 h-6 w-6" />
                                Rewards
                            </Link>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            {/* className={className + "  bg-slate-950 p-4 space-y-5 "} */}
            {/* {...props} */}
            {/* <div>
                <div className="flex gap-5 items-center justify-center font-bold bg-[#141414] rounded-md p-2">
                    <div className="flex gap-3 items-center">
                        <span className="text-[#5AC35D]">€</span>

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

                    <a href="http://" className="text-black">
                        <PrimaryButton
                            className="py-2"
                            onClick={() => addBalace(200)}
                        >
                            Deposit
                        </PrimaryButton>
                    </a>

                    <span className="flex gap-3 items-center">
                        <BottleIcon width="14" height="21" /> 3
                    </span>
                </div>

                <div className="uppercase px-4 space-y-5">
                    <a
                        href="http://"
                        className="flex items-center gap-3 hover-underline-animation "
                    >
                        <GamePadIcon className="-mt-1 h-6 w-6" />
                        Games
                    </a>

                    <a
                        href="http://"
                        className="flex items-center gap-3 hover-underline-animation"
                    >
                        <UsersIcon className="-mt-1 h-6 w-6" />
                        AFFILIATED
                    </a>

                    <a
                        href="http://"
                        className="flex items-center gap-3 hover-underline-animation"
                    >
                        <GiftIcon className="-mt-1 h-6 w-6" />
                        Rewards
                    </a>
                </div>
            </div> */}
        </>
    );
}
