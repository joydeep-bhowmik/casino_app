import Layout from "@/Layouts/Layout";
import { Link } from "@inertiajs/react";

export default function Home({ games }) {
    return (
        <Layout>
            <div className="px-5">
                {/* livechat */}
                <div></div>

                <div className="lg:ml-[250px] ">
                    {/* main */}
                    <div className=" overflow-hidden ">
                        <img
                            src={url("/storage/banner.png")}
                            className="object-contain w-full"
                        />
                    </div>

                    <div className="space-y-7 mt-10">
                        {games.length ? (
                            <>
                                <h2 className="text-2xl capitalize font-bold">
                                    All games
                                </h2>
                                <div className="flex flex-wrap gap-5">
                                    {games.map((game) => (
                                        <Link
                                            to={game.url}
                                            className="h-[160px] w-[200px] relative"
                                            key={game.id}
                                        >
                                            <img
                                                src={url(game.thumbnail_url)}
                                                alt=""
                                                className="h-full object-contain"
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
