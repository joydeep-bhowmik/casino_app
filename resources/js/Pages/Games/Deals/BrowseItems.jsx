import Input from "@/Components/Input";
import { useState } from "react";
import SearchIcon from "./SearchIcon.jsx";
import Select from "@/Components/Games/Select";
import React from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce } from "lodash";
import { useInfiniteQuery } from "@tanstack/react-query";
import Item from "./Item.jsx";

export default function BrowseItems({ handleSelect, product }) {
    const [page, setPage] = useState(1);
    const [state, setState] = useState({
        items: [],
        key: "",
        sortBy: "",
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

    const fetchPosts = async ({ pageParam = 1 }) => {
        const response = await axios.post(route("products.search"), {
            key: state.key,
            sortBy: state.sortBy,
            minPrice: state.minPrice,
            maxPrice: state.maxPrice,
            page: pageParam,
        });
        return response.data;
    };

    const {
        data,
        isLoading,
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: [state.key, state.sortBy, state.minPrice, state.maxPrice],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage, pages) => {
            if (!lastPage.next_page_url) {
                return;
            }
            let url = new URL(lastPage.next_page_url);

            return url.searchParams.get("page");
        },
    });

    const handleLoadMore = () => {
        if (!isLoading && hasNextPage) {
            // Fetch more data when user scrolls to the bottom
            fetchMore();
        }
    };

    return (
        <div className="w-full p-3 rounded-md bg">
            <h2 className="text-2xl font-bold text-white">Available Items</h2>
            <div className="space-y-3 mt-8">
                <Input
                    placeholder="Search by name"
                    prefix={
                        <div className="ml-2">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                    }
                    onChange={(e) => debounceKey(e.target.value)}
                />

                <div className="flex gap-2">
                    <Input
                        placeholder="Min price"
                        className="w-full"
                        prefix={<span className="ml-2">$</span>}
                        onChange={(e) => debounceMinPrice(e.target.value)}
                    />

                    <Input
                        placeholder="Max price"
                        className="w-full"
                        prefix={<span className="ml-2">$</span>}
                        onChange={(e) => debounceMaxPrice(e.target.value)}
                    />
                </div>

                <Select
                    className=" border-[#1D1D20] !border-2 -mt-2"
                    onChange={(e) => {
                        setState((pre) => ({
                            ...pre,
                            sortBy: e.target.value,
                        }));
                    }}
                >
                    <option value="lowToHigh">Price (Low to High)</option>
                    <option value="highToLow">Price (High to Low)</option>
                </Select>

                <div
                    className="h-96 mt-5 overflow-y-scroll custom-scrollbar"
                    id="items-scroll"
                >
                    <InfiniteScroll
                        dataLength={data?.pages.length || 0}
                        next={fetchNextPage}
                        hasMore={hasNextPage}
                        loader={<Loader />}
                        scrollableTarget="items-scroll"
                    >
                        <div className="columns-2 h-full space-y-4">
                            {data?.pages.map((pageData, pageIndex) => (
                                <React.Fragment key={pageIndex}>
                                    {pageData.data.map((post) => (
                                        <Item
                                            product={post}
                                            key={post.id}
                                            onClick={() => {
                                                handleSelect(post);
                                            }}
                                            isSelected={product.id == post.id}
                                        />
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </InfiniteScroll>

                    {isLoading && <Loader />}
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
