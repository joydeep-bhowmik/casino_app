import Input from "@/Components/Input";
import { useState } from "react";
import SearchIcon from "../../Components/Icons/SearchIcon.jsx";
import React from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce } from "lodash";
import { useInfiniteQuery } from "@tanstack/react-query";
import Item from "./Item.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function BrowseItems({ handleSelect, selectedItems }) {
    const [state, setState] = useState({
        items: [],
        key: "",
        sortBy: "lowToHigh",
        minPrice: "",
        maxPrice: "",
        next_page_url: false,
    });

    const debounceKey = debounce((value) => {
        setState((prevState) => ({ ...prevState, key: value }));
    }, 300);

    const debounceMinPrice = debounce((value) => {
        setState((prevState) => ({ ...prevState, minPrice: value }));
    }, 300);

    const debounceMaxPrice = debounce((value) => {
        setState((prevState) => ({ ...prevState, maxPrice: value }));
    }, 300);

    const fetchItems = async ({ pageParam = 1 }) => {
        try {
            const response = await axios.post(route("items.search"), {
                key: state.key,
                sortBy: state.sortBy,
                minPrice: state.minPrice,
                maxPrice: state.maxPrice,
                page: pageParam,
            });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    };

    const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: [state.key, state.sortBy, state.minPrice, state.maxPrice],
        queryFn: fetchItems,
        getNextPageParam: (lastPage, pages) => {
            if (!lastPage.next_page_url) {
                return;
            }
            let url = new URL(lastPage.next_page_url);

            return url.searchParams.get("page");
        },
    });

    const addToCart = async (id) => {
        try {
            let response = await axios.post(route("carts.add"));
            return response.data;
        } catch (error) {
            console.error(error);
        }
    };

    const allData = () => data?.pages.flatMap((page) => page.data);

    return (
        <div className="w-full p-3 rounded-md ">
            <div className="space-y-3">
                <div className="lg:flex gap-2 space-y-3">
                    <Input
                        placeholder="Search by name"
                        className="max-w-xs "
                        label={true}
                        wrapperClassName="lg:!w-fit"
                        prefix={
                            <div className="ml-2">
                                <SearchIcon className="w-4 h-4" />
                            </div>
                        }
                        onChange={(e) => debounceKey(e.target.value)}
                    />

                    <div>
                        <Select
                            value={state.sortBy}
                            onValueChange={(value) =>
                                setState((pre) => ({
                                    ...pre,
                                    sortBy: value,
                                }))
                            }
                        >
                            <SelectTrigger className="lg:w-[180px] w-full">
                                <SelectValue placeholder={"Select "} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lowToHigh">
                                    Price (Low to High)
                                </SelectItem>
                                <SelectItem value="HighToLow">
                                    Price (High to Low)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Min price"
                            className="w-full"
                            prefix={
                                <span className="ml-2 text-slate-600">$</span>
                            }
                            onChange={(e) => debounceMinPrice(e.target.value)}
                        />

                        <Input
                            placeholder="Max price"
                            className="w-full"
                            prefix={
                                <span className="ml-2 text-slate-600">$</span>
                            }
                            onChange={(e) => debounceMaxPrice(e.target.value)}
                        />
                    </div>
                </div>

                <div
                    className="h-96 mt-5 overflow-y-scroll custom-scrollbar"
                    id="my-item-scroll"
                >
                    <InfiniteScroll
                        dataLength={data?.pages.length || 0}
                        next={fetchNextPage}
                        hasMore={hasNextPage}
                        loader={<Loader />}
                        scrollableTarget="my-item-scroll"
                    >
                        <div className="columns-2 md:columns-3 lg:columns-4 h-full space-y-4">
                            {data?.pages.map((pageData, pageIndex) => (
                                <React.Fragment key={pageIndex}>
                                    {pageData.data.map((item) => (
                                        <Item
                                            product={item.product}
                                            key={item.id}
                                            onClick={() => {
                                                handleSelect(item);
                                            }}
                                            isSelected={
                                                selectedItems &&
                                                selectedItems.find((i) => {
                                                    return i.id == item.id;
                                                })
                                            }
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </InfiniteScroll>

                    {isLoading && <Loader />}

                    {!isLoading && !allData()?.length ? (
                        <div className="text-center p-5">
                            <span className="capitalize ">No items here</span>
                        </div>
                    ) : (
                        ""
                    )}
                    <div className="h-1/2"></div>
                </div>
            </div>
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
