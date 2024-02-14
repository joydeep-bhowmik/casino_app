import React, { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import Dialog from "./Dialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { url } from "@/Libs/urls";
import { useMemo } from "react";
import axios from "axios";
import { useStore } from "@/Store/main";

export default function Carts({ refresh = 0 }) {
    const updateBalance = useStore((state) => state.updateBalance);
    const balance = useStore((state) => state.balance);

    const [refreshCount, SetRefreshCount] = useState(refresh);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selling, setSelling] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchCarts = async ({ pageParam = 1 }) => {
        const response = await axios.post(route("carts.paginate"), {
            page: pageParam,
        });

        return response.data;
    };

    const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: [refreshCount],
        queryFn: fetchCarts,
        getNextPageParam: (lastPage, pages) => {
            if (!lastPage.next_page_url) {
                return;
            }
            let url = new URL(lastPage.next_page_url);

            return url.searchParams.get("page");
        },
    });

    const carts = useMemo(
        () => data?.pages.flatMap((page) => page.data),
        [data]
    );

    const total = selectedItems.reduce(
        (total, item) => parseInt(total) + parseInt(item.product.price),
        0
    );

    const handleChange = (e) => {
        console.log(e.target.value);
        if (e.target.checked) {
            setSelectedItems((pre) => [
                ...pre,
                carts.find((item) => item.id == e.target.value),
            ]);
        } else {
            setSelectedItems((pre) =>
                pre.filter((item) => item.id != e.target.value)
            );
        }
    };

    const sellItem = async () => {
        setSelling(true);
        try {
            let response = await axios.post(route("sell.items"), {
                items: selectedItems,
            });

            if (response.statusText) {
                SetRefreshCount((pre) => ++pre);
                setSelectedItems([]);
                updateBalance(response.data.balance);
                return true;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSelling(false);
        }
    };

    const DeleteAllCarts = async () => {
        setDeleting(true);
        try {
            let response = await axios.post(route("carts.delete"), {
                items: selectedItems,
            });

            if (response.statusText) {
                SetRefreshCount((pre) => ++pre);
                setSelectedItems([]);
                return true;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="w-full  space-y-5">
            <div className="flex">
                <h1 className="text-xl font-semibold">Cart</h1>
                <div className="ml-auto">
                    {selectedItems.length ? (
                        <Dialog
                            description="This action cannot be undone. This will permanently remove all your carts from our servers."
                            onConfirm={DeleteAllCarts}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="none"
                                viewBox="0 0 30 30"
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
                                        <stop
                                            offset="0.984"
                                            stopColor="#ED7D7D"
                                        ></stop>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </Dialog>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            <InfiniteScroll
                dataLength={data?.pages.length || 0}
                next={fetchNextPage}
                hasMore={hasNextPage}
                loader={<Loader />}
            >
                <div className=" space-y-3">
                    {data?.pages.map((pageData, pageIndex) => (
                        <React.Fragment key={pageIndex}>
                            {pageData.data.map((cart) => (
                                <div
                                    key={cart.id}
                                    className="flex gap-2 p-5 relative rounded-md border-l-red-700 border-l-2 bg-[#181818] "
                                >
                                    <div className="grid place-items-center w-full max-w-[30px] ">
                                        <input
                                            onChange={handleChange}
                                            type="checkbox"
                                            value={cart.id}
                                            className=" bg-green-950 border-green-950 ring-2 focus:ring-green-500  ring-green-600 text-green-950 rounded"
                                        />
                                    </div>
                                    <div className="h-20 w-full max-w-[100px]">
                                        <img
                                            src={url(cart.product.image_url)}
                                            alt=""
                                            className="h-full object-contain"
                                        />
                                    </div>
                                    <div className=" w-full">
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
                        </React.Fragment>
                    ))}
                </div>
            </InfiniteScroll>

            {isLoading ? <Loader /> : ""}

            {carts && carts.length ? (
                <>
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

                    <div className="flex flex-col gap-3">
                        <PrimaryButton
                            className="text-black"
                            onClick={sellItem}
                            disabled={!selectedItems.length}
                        >
                            {selling ? "selling..." : `Sell for $${total}`}
                        </PrimaryButton>

                        <PrimaryButton
                            style={{ background: "#1B3D16" }}
                            onClick={sellItem}
                            disabled={!selectedItems.length}
                        >
                            checkout
                        </PrimaryButton>
                    </div>
                </>
            ) : !isLoading ? (
                <div className="p-5 py-10 grid place-items-center text-lg capitalize h-full ">
                    Empty
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
function Loader() {
    return (
        <div className="grid place-items-center py-10 ">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 animate-spin"
            >
                <path d="M18.364 5.63604L16.9497 7.05025C15.683 5.7835 13.933 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12H21C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.4853 3 16.7353 4.00736 18.364 5.63604Z"></path>
            </svg>
        </div>
    );
}
