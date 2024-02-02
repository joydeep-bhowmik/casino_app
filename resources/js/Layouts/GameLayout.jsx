import Layout from "./Layout";
import ArrowLeft from "../Components/Icons/ArrowLeft";
import { Link } from "@inertiajs/react";
export default function GameLayout({ title, children }) {
    return (
        <Layout>
            <div className="columns-3 justify-center">
                <div>
                    <Link
                        href={url("/")}
                        className="capitalize text-white flex items-center gap-2"
                    >
                        <ArrowLeft />{" "}
                        <span className="hidden lg:block">back to home</span>
                    </Link>
                </div>

                <div className=" text-center">
                    {title ? <h2 className="text-2xl">{title}</h2> : ""}
                </div>
            </div>
            <div className="mt-10 p-5">{children}</div>
        </Layout>
    );
}
