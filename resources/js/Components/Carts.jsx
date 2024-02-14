import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { router } from "@inertiajs/react";
import { url } from "@/Libs/urls";
import axios from "axios";
import { useStore } from "@/Store/main";
import { useToast } from "./ui/use-toast";
import Dialog from "./Dialog";

export default function items({
    items = [],
    removeItems = () => {},
    deleteAll = () => {},
    onSold = () => {},
    onCheckout = () => {},
}) {
    const { toast } = useToast();
    const updateBalance = useStore((state) => state.updateBalance);
    const [selling, setSelling] = useState(false);
    const [checkingout, setCheckingout] = useState(false);
    const total = items.reduce(
        (total, item) => parseInt(total) + parseInt(item.product.price),
        0
    );

    const sellItem = async () => {
        setSelling(true);
        try {
            let response = await axios.post(route("items.sell"), {
                items: items,
            });
            if (response.data.success) {
                updateBalance(response.data.balance);
            }

            if (response.data.itemsSold.length) {
                toast({
                    title: "Items sold",
                    description: `${response.data.itemsSold.length} Items sold and money is added to your wallet`,
                });

                onSold(items);
            }

            return response.data;
        } catch (error) {
            console.error(error);
        } finally {
            setSelling(false);
        }
    };

    const addItemsToCart = async () => {
        setCheckingout(true);
        try {
            let response = await axios.post(route("carts.add-valid-items"), {
                items: items,
            });

            onCheckout(response.data.items);
            return response.data;
        } catch (error) {
            console.error(error);
            toast({
                title: "Some error occurred",
                description: error.response.data.error,
                variant: "destructive",
            });
        } finally {
            setCheckingout(false);
        }
    };
    return (
        <div className="w-full  space-y-5">
            {items.length ? (
                <>
                    {items.length ? (
                        <DeleteButton
                            className="ml-auto cursor-pointer"
                            onClick={deleteAll}
                        />
                    ) : (
                        ""
                    )}
                    <div className="divide-x space-y-3 h-56 p-3 overflow-y-scroll custom-scrollbar">
                        {items.map((cart) => (
                            <div
                                key={cart.id}
                                className="flex items-center gap-8 p-3 relative rounded-md border-l-red-700 border-l-2 bg-[#181818] "
                            >
                                <div className="h-20  max-w-20">
                                    <img
                                        src={url(cart.product.image_url)}
                                        alt=""
                                        className="h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">
                                        {cart.product.name}
                                    </h3>
                                    <div className="text-base font-bold">
                                        €{cart.product.price}
                                    </div>
                                </div>
                                <div className="w-fit ml-auto ">
                                    <button
                                        className="absolute top-5 right-5"
                                        onClick={() => {
                                            removeItems(cart.id);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="7"
                                            height="7"
                                            viewBox="0 0 7 7"
                                            fill="none"
                                        >
                                            <path
                                                d="M3.5 4.24525L0.891635 6.85361C0.794043 6.9512 0.669835 7 0.519011 7C0.368188 7 0.24398 6.9512 0.146388 6.85361C0.0487959 6.75602 0 6.63181 0 6.48099C0 6.33016 0.0487959 6.20596 0.146388 6.10837L2.75475 3.5L0.146388 0.891635C0.0487959 0.794043 0 0.669835 0 0.519011C0 0.368188 0.0487959 0.24398 0.146388 0.146388C0.24398 0.0487959 0.368188 0 0.519011 0C0.669835 0 0.794043 0.0487959 0.891635 0.146388L3.5 2.75475L6.10837 0.146388C6.20596 0.0487959 6.33016 0 6.48099 0C6.63181 0 6.75602 0.0487959 6.85361 0.146388C6.9512 0.24398 7 0.368188 7 0.519011C7 0.669835 6.9512 0.794043 6.85361 0.891635L4.24525 3.5L6.85361 6.10837C6.9512 6.20596 7 6.33016 7 6.48099C7 6.63181 6.9512 6.75602 6.85361 6.85361C6.75602 6.9512 6.63181 7 6.48099 7C6.33016 7 6.20596 6.9512 6.10837 6.85361L3.5 4.24525Z"
                                                fill="#5F5F5F"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className=" p-5 rounded-md border divide-y divide-slate-800 border-slate-800 ">
                        <div className="flex p-3">
                            <span>Selected</span>
                            <span className="ml-auto">{items.length}</span>
                        </div>
                        <div className="flex p-3">
                            <span>Total</span>
                            <span className="ml-auto">{total}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Dialog
                            title="Are you sure?"
                            description="This items will be sold and the amount will be added to your wallet"
                            onConfirm={sellItem}
                        >
                            <div
                                className="text-black primary-btn inline-flex  items-center justify-center p-4  border border-transparent  font-semibold 
                                text-xs uppercase tracking-widest w-full"
                                disabled={!items.length || selling}
                            >
                                {selling ? `selling...` : `Sell for $${total}`}
                            </div>
                        </Dialog>

                        <Dialog
                            title="Are you sure?"
                            description="ready to checkout"
                            onConfirm={addItemsToCart}
                        >
                            <div
                                className="rounded-md bg-[#1B3D16] inline-flex  items-center justify-center p-4  border border-transparent  font-semibold 
                                text-xs uppercase tracking-widest w-full"
                                disabled={!items.length || checkingout}
                            >
                                {checkingout ? `checkingout...` : `checkout`}
                            </div>
                        </Dialog>
                    </div>
                </>
            ) : (
                <div className="p-5 py-10 grid place-items-center text-lg h-full ">
                    Your cart is currently empty.
                </div>
            )}
        </div>
    );
}

function DeleteButton(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="none"
            viewBox="0 0 30 30"
            {...props}
        >
            <rect
                width="30"
                height="30"
                fill="#1B1B1B"
                opacity="0.8"
                rx="8"
            ></rect>
            <path
                fill="#6A6A6A"
                d="M11.875 21c-.344 0-.638-.13-.883-.392a1.328 1.328 0 01-.367-.941V11a.586.586 0 01-.445-.192.668.668 0 01-.18-.475c0-.189.06-.347.18-.475a.586.586 0 01.445-.191h2.5c0-.19.06-.348.18-.475A.586.586 0 0113.75 9h2.5c.177 0 .326.064.445.192.12.127.18.286.18.475h2.5c.177 0 .326.064.445.191.12.128.18.286.18.475 0 .19-.06.348-.18.475a.586.586 0 01-.445.192v8.667c0 .366-.122.68-.367.941a1.167 1.167 0 01-.883.392h-6.25zm6.25-10h-6.25v8.667h6.25V11zm-5 7.333h1.25v-6h-1.25v6zm2.5 0h1.25v-6h-1.25v6z"
            ></path>
            <path
                fill="url(#paint0_linear_153_20502)"
                d="M11.875 21c-.344 0-.638-.13-.883-.392a1.328 1.328 0 01-.367-.941V11a.586.586 0 01-.445-.192.668.668 0 01-.18-.475c0-.189.06-.347.18-.475a.586.586 0 01.445-.191h2.5c0-.19.06-.348.18-.475A.586.586 0 0113.75 9h2.5c.177 0 .326.064.445.192.12.127.18.286.18.475h2.5c.177 0 .326.064.445.191.12.128.18.286.18.475 0 .19-.06.348-.18.475a.586.586 0 01-.445.192v8.667c0 .366-.122.68-.367.941a1.167 1.167 0 01-.883.392h-6.25zm6.25-10h-6.25v8.667h6.25V11zm-5 7.333h1.25v-6h-1.25v6zm2.5 0h1.25v-6h-1.25v6z"
            ></path>
            <defs>
                <linearGradient
                    id="paint0_linear_153_20502"
                    x1="14.981"
                    x2="14.981"
                    y1="19.971"
                    y2="9"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#C35A5A"></stop>
                    <stop offset="0.984" stopColor="#ED7D7D"></stop>
                </linearGradient>
            </defs>
        </svg>
    );
}
