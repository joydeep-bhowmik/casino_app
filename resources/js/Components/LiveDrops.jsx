import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { url } from "@/Libs/urls";
import InfiniteScroll from "react-infinite-scroll-component";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "@inertiajs/react";
import Autoplay from "embla-carousel-autoplay";

export default function LiveDrops() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    );

    const fetchDrops = async ({ pageParam = 1 }) => {
        try {
            let response = await axios.post(route("livedrops.paginate"), {
                page: pageParam,
            });
            response = response.data;
            return response;
        } catch (error) {
            console.error(error);
        }
    };
    const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["none"],
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
        <div
            className="overflow-y-auto custom-scrollbar h-96 space-y-3 my-3 p-2 max-w-full"
            id="y-livedrops-scroll"
        >
            <div className="h-96 mt-5 ">
                <InfiniteScroll
                    dataLength={data?.pages.length || 0}
                    next={fetchNextPage}
                    hasMore={hasNextPage}
                    loader={<Loader />}
                    scrollableTarget="my-livedrops-scroll"
                >
                    <div className="space-y-3">
                        {data?.pages.map((pageData, pageIndex) => (
                            <React.Fragment key={pageIndex}>
                                {pageData.data.map((suitcase) => (
                                    <Link
                                        href={route(
                                            "games.roteta",
                                            suitcase.slug
                                        )}
                                        key={suitcase.id}
                                    >
                                        <Carousel
                                            plugins={[plugin.current]}
                                            onMouseEnter={plugin.current.stop}
                                            onMouseLeave={plugin.current.reset}
                                        >
                                            <CarouselContent>
                                                {suitcase.products.map(
                                                    (product, index) => (
                                                        <CarouselItem
                                                            key={index}
                                                        >
                                                            <div className="p-5 item-bg-gradiant h-32 relative">
                                                                <img
                                                                    src={url(
                                                                        product.image_url
                                                                    )}
                                                                    className="object-contain h-full mx-auto"
                                                                />

                                                                <div className="absolute bottom-3 left-3 text-sm">
                                                                    <div>
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </div>
                                                                    <div className="font-semibold">
                                                                        €{" "}
                                                                        {
                                                                            product.price
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <button className="absolute top-4 right-4">
                                                                    <svg
                                                                        width={
                                                                            14
                                                                        }
                                                                        height={
                                                                            14
                                                                        }
                                                                        viewBox="0 0 14 14"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <g opacity="0.1">
                                                                            <path
                                                                                d="M12.3332 6.99996C12.3332 9.94548 9.94536 12.3333 6.99984 12.3333C4.05432 12.3333 1.6665 9.94548 1.6665 6.99996C1.6665 4.05444 4.05432 1.66663 6.99984 1.66663C9.94536 1.66663 12.3332 4.05444 12.3332 6.99996Z"
                                                                                stroke="white"
                                                                            />
                                                                            <path
                                                                                d="M5.8335 6.99997V4.97925L7.5835 5.98961L9.3335 6.99997L7.5835 8.01034L5.8335 9.0207V6.99997Z"
                                                                                fill="#D9D9D9"
                                                                            />
                                                                        </g>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </CarouselItem>
                                                    )
                                                )}
                                            </CarouselContent>
                                        </Carousel>
                                    </Link>
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
