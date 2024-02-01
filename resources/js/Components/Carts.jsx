import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { router } from "@inertiajs/react";
import { useAlert } from "react-alert";

export default function Carts({ carts = [] }) {
    const alert = useAlert();

    const [selectedItems, setSelectedItems] = useState([]);

    const total = selectedItems.reduce(
        (total, item) => parseInt(total + item.product.price),
        0
    );

    const handleChange = (e) => {
        if (e.target.checked) {
            setSelectedItems((pre) => [
                ...pre,
                carts.find((item) => item.id == e.target.value),
            ]);
        } else {
            setSelectedItems((pre) =>
                pre.filter((item) => item.id === e.target.value)
            );
        }
    };

    const sellItem = () => {
        router.post(
            route("sell.items"),
            { items: selectedItems },
            {
                onSuccess: (page) => {
                    alert.success("Items sold for $" + total);
                    setSelectedItems((pre) =>
                        pre.filter((item) => !selectedItems.includes(item))
                    );
                },
                onError: (errors) => {
                    errors.forEach((error) => {
                        alert.error(error);
                    });
                },
            }
        );
    };

    return (
        <div className="w-full  space-y-5">
            {carts.length ? (
                <>
                    <div className="divide-x ">
                        {carts.map((cart) => (
                            <div
                                key={cart.id}
                                className="flex items-center gap-8 p-5 relative rounded-md border-l-red-700 border-l-2 bg-[#181818] "
                            >
                                <div className="grid place-items-center w-full max-w-16">
                                    <input
                                        onChange={handleChange}
                                        type="checkbox"
                                        value={cart.id}
                                        className=" bg-green-950 border-green-950 ring-2 focus:ring-green-500  ring-green-600 text-green-950 rounded"
                                    />
                                </div>
                                <div className="h-20 ">
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
                                    <button className="absolute top-5 right-5">
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
                            <span className="ml-auto">
                                {selectedItems.length}
                            </span>
                        </div>
                        <div className="flex p-3">
                            <span>Total</span>
                            <span className="ml-auto">{total}</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <PrimaryButton
                            className="text-black"
                            onClick={sellItem}
                            disabled={!selectedItems.length}
                        >
                            Sell for ${total}
                        </PrimaryButton>
                    </div>
                </>
            ) : (
                <div className="p-5 py-10 grid place-items-center text-lg capitalize h-full ">
                    Empty
                </div>
            )}
        </div>
    );
}
