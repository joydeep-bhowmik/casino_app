import { Transition } from "@headlessui/react";
import React from "react";
import PrimaryButton from "./PrimaryButton";
import GiftIcon from "./Icons/GiftIcon";
import UsersIcon from "./Icons/UsersIcon";
import BottleIcon from "./Icons/BottleIcon";
import GamePadIcon from "./Icons/GamePadIcon";
export default function MobileMenu({ open, className, ...props }) {
    return (
        <>
            <div
                className={
                    className +
                    " lg:hidden absolute z-10  top-20 w-full left-0 right-0 bg-slate-950 p-4 space-y-5 " +
                    (open ? "block" : "hidden ")
                }
                {...props}
            >
                <div className="flex gap-5 items-center justify-center font-bold bg-[#141414] rounded-md p-2">
                    <div className="flex gap-3 items-center">
                        <span className="text-[#5AC35D]">€</span> 0.00
                    </div>

                    <a href="http://" className="text-black">
                        <PrimaryButton className="py-2">Deposit</PrimaryButton>
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
            </div>
        </>
    );
}
