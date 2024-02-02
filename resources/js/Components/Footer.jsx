import React from "react";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import ApplicationLogo from "./ApplicationLogo";

export default function Footer() {
    const { pages, socials } = usePage().props.data;
    return (
        <footer className="bg mt-10  ">
            <div className="max-content-width  border-b border-[#292929] flex flex-col gap-8 md:grid md:grid-cols-[auto_auto_auto] p-8">
                <div className="flex  gap-5">
                    {socials.map((s) => (
                        <a href={s.link} key={s.id} target="_blank">
                            <img src={s.image_url} alt="" className="h-6 w-6" />
                        </a>
                    ))}
                </div>
                <div className="flex lg:flex-row flex-col gap-8  break-inside-avoid-column">
                    {pages.map((p) => (
                        <Link
                            href={`/pages/${p.slug}`}
                            key={p.slug}
                            className="uppercase"
                        >
                            {p.title}
                        </Link>
                    ))}
                </div>
            </div>
            <div className=" max-content-width flex md:gap-28 md:flex-row flex-col gap-8 items-center p-8">
                <ApplicationLogo />

                <p>
                    Copyright © {new Date().getFullYear()}{" "}
                    {window.location.host}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
