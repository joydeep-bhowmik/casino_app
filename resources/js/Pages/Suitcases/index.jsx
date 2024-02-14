import Input from "@/Components/Input";
import Layout from "@/Layouts/Layout";
import SearchIcon from "@/Components/Icons/SearchIcon";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useState } from "react";
import cn from "@/Libs/cn";
import Suitcase from "@/Components/Suitcase";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@/Components/Loader";
import { debounce } from "lodash";

export default function index() {
    const [sort, setSort] = useState("lowToHigh");
    const [key, setkey] = useState("");
    const [tab, setTab] = useState("featured");
    const BtnClass = `font-semibold py-5 ml-5 `;

    const handleKey = debounce((value) => {
        setkey(value);
    }, 300);

    const fetchDrops = async ({ pageParam = 1 }) => {
        try {
            let response = await axios.post(route("livedrops.paginate"), {
                page: pageParam,
                sortBy: sort,
                flag: tab == "all" ? null : tab,
                key: key,
            });
            response = response.data;
            return response;
        } catch (error) {
            console.error(error);
        }
    };

    const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: [sort, tab, key],
        queryFn: fetchDrops,
        getNextPageParam: (lastPage) => {
            if (!lastPage.next_page_url) {
                return;
            }
            let url = new URL(lastPage.next_page_url);

            return url.searchParams.get("page");
        },
    });

    const allData = () => data?.pages.flatMap((page) => page.data);

    return (
        <Layout>
            <div>
                <h1 className="text-2xl font-semibold">All Suitcases</h1>
            </div>

            <div className="mt-5 flex md:flex-row flex-col  items-center  gap-3 border-b border-b-slate-800">
                <div className="flex  items-center  gap-3 ">
                    <div>
                        <Input
                            prefix={<SearchIcon className="w-4 h-4 ml-2" />}
                            placeholder="Search Boxes"
                            className="max-w-[200px] "
                            wrapperClassName="!w-fit"
                            onChange={(e) => handleKey(e.target.value)}
                        />
                    </div>

                    <div>
                        <Select
                            value={sort}
                            onValueChange={(value) => setSort(value)}
                        >
                            <SelectTrigger className="w-[180px] ">
                                <SelectValue placeholder={"Select a fruit"} />
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
                </div>

                <div>
                    <button
                        className={cn([
                            BtnClass,
                            tab == "all"
                                ? "opacity-100 border-b"
                                : "opacity-50",
                        ])}
                        onClick={() => setTab("all")}
                    >
                        All
                    </button>
                    <button
                        className={cn([
                            BtnClass,
                            tab == "featured"
                                ? "opacity-100 border-b"
                                : "opacity-50",
                        ])}
                        onClick={() => setTab("featured")}
                    >
                        Featured
                    </button>
                    <button
                        className={cn([
                            BtnClass,
                            tab == "new"
                                ? "opacity-100 border-b"
                                : "opacity-50",
                        ])}
                        onClick={() => setTab("new")}
                    >
                        New
                    </button>
                    <button
                        className={cn([
                            BtnClass,
                            tab == "hot"
                                ? "opacity-100 border-b"
                                : "opacity-50",
                        ])}
                        onClick={() => setTab("hot")}
                    >
                        Hot
                    </button>
                </div>
            </div>

            <div id="my-livedrops-scroll-2">
                <InfiniteScroll
                    dataLength={data?.pages.length || 0}
                    next={fetchNextPage}
                    hasMore={hasNextPage}
                    loader={
                        <div className="w-full p-10 grid place-items-center">
                            <Loader />
                        </div>
                    }
                    scrollableTarget="my-livedrops-scroll-2"
                >
                    <div className="columns-2 md:columns-3 lg:columns-5 py-5 space-y-4">
                        {data?.pages.map((page, index) =>
                            page.data.map((suitcase) => (
                                <Suitcase data={suitcase} key={suitcase.id} />
                            ))
                        )}
                    </div>
                </InfiniteScroll>

                {isLoading ? (
                    <div className="w-full p-5 grid place-items-center">
                        <Loader />
                    </div>
                ) : (
                    ""
                )}

                {!isLoading && !allData()?.length ? (
                    <div className="w-full p-5 grid place-items-center capitalize">
                        Nothing here
                    </div>
                ) : (
                    ""
                )}
            </div>
        </Layout>
    );
}
