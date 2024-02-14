import Chatbox from "@/Components/Chatbox";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import LiveDrops from "@/Components/LiveDrops";
import { useSideBarStore } from "@/Store/Sidebar";

export default function Layout({ children, sideBar = true, ...props }) {
    const user = usePage().props.auth.user;

    const { activeTab, setActiveTab } = useSideBarStore((state) => state);

    const [showSideBar, setShowSideBar] = useState(false);

    const btnClass = `bg border-2 px-5 py-2 w-full flex  justify-center rounded block break-inside-avoid-column`;
    return (
        <>
            <Header user={user} />

            <div className="min-h-screen  ">
                <div
                    className={`fixed top-0 left-0 right-0 bottom-0 h-full w-full bg-black opacity-70 z-10 ${
                        showSideBar ? "block " : "hidden"
                    }`}
                    onClick={() => setShowSideBar(false)}
                ></div>

                <div className={`relative `}>
                    <aside
                        key="sidebar"
                        className={`max-w-[280px] w-full h-full flex flex-col p-3 bg-black transition-all ease-in-out duration-300
                     fixed top-0 lg:top-0 lg:absolute z-10 ${
                         showSideBar ? "left-0" : "-left-[280px] lg:left-0"
                     }`}
                    >
                        <button
                            className={`lg:hidden  absolute  top-1/2 transform -translate-y-1/2 bg-slate-600 py-5  z-10 -right-5 rounded-lg  ${
                                showSideBar ? "rotate-180" : "rotate-0"
                            }`}
                            onClick={() => setShowSideBar((pre) => !pre)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        </button>
                        <div className="flex justify-center gap-3 px-3 py-2 bg-[#111] ">
                            <button
                                type="button"
                                className={` ${btnClass}  ${
                                    activeTab == "livedrops"
                                        ? " border-[#5AC35D] bg-[#101E10]"
                                        : "border-transparent bg-[#1C1C1C]"
                                }`}
                                onClick={() => {
                                    setActiveTab("livedrops");
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M3.97461 4.97485H2.97461V6.97485H3.97461V4.97485ZM19.9746 6.97485C20.5269 6.97485 20.9746 6.52714 20.9746 5.97485C20.9746 5.42257 20.5269 4.97485 19.9746 4.97485V6.97485ZM3.97461 6.97485H19.9746V4.97485H3.97461V6.97485Z"
                                        fill="#333333"
                                    />
                                    <path
                                        d="M3.97461 10.9749H2.97461V12.9749H3.97461V10.9749ZM19.9746 12.9749C20.5269 12.9749 20.9746 12.5271 20.9746 11.9749C20.9746 11.4226 20.5269 10.9749 19.9746 10.9749V12.9749ZM3.97461 12.9749H19.9746V10.9749H3.97461V12.9749Z"
                                        fill="#333333"
                                    />
                                    <path
                                        d="M3.97461 16.9749H2.97461V18.9749H3.97461V16.9749ZM19.9746 18.9749C20.5269 18.9749 20.9746 18.5271 20.9746 17.9749C20.9746 17.4226 20.5269 16.9749 19.9746 16.9749V18.9749ZM3.97461 18.9749H19.9746V16.9749H3.97461V18.9749Z"
                                        fill="#333333"
                                    />
                                </svg>
                            </button>
                            {/* 
                        <button type="button" className={setClass("chaaat")}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <g clipPath="url(#clip0_153_1649)">
                                    <path
                                        d="M10.6041 20.2442H9.64013L10.6041 13.4961H7.2301C6.38176 13.4961 6.91197 12.7731 6.93125 12.7442C8.17483 10.5462 10.045 7.2686 12.5418 2.89197H13.5058L12.5418 9.64007H15.9255C16.3111 9.64007 16.5232 9.82323 16.3111 10.2763C12.5033 16.9184 10.6041 20.2442 10.6041 20.2442Z"
                                        fill="#333333"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_153_1649">
                                        <rect
                                            width="23.1364"
                                            height="23.1364"
                                            rx="4"
                                            fill="white"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button> */}
                            <button
                                type="button"
                                className={` ${btnClass}  ${
                                    activeTab == "chat"
                                        ? " border-[#5AC35D] bg-[#101E10]"
                                        : "border-transparent bg-[#1C1C1C]"
                                }`}
                                onClick={() => {
                                    setActiveTab("chat");
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                >
                                    <path
                                        d="M18.3337 3.91663C18.3337 3.36434 17.8859 2.91663 17.3337 2.91663H2.66699C2.11471 2.91663 1.66699 3.36434 1.66699 3.91663V14.4166C1.66699 14.9689 2.11471 15.4166 2.66699 15.4166H3.7879C4.22738 15.4166 4.58366 15.7729 4.58366 16.2124C4.58366 16.8039 5.20619 17.1887 5.7353 16.9241L8.53918 15.5222C8.67804 15.4528 8.83115 15.4166 8.98639 15.4166H17.3337C17.8859 15.4166 18.3337 14.9689 18.3337 14.4166V3.91663Z"
                                        fill="#61CB64"
                                        stroke="#61CB64"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M12.917 6.66663V7.08329"
                                        stroke="#101E10"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="bevel"
                                    />
                                    <path
                                        d="M7.08301 6.66663V7.08329"
                                        stroke="#101E10"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="bevel"
                                    />
                                    <path
                                        d="M12.9163 10.4166C12.9163 10.4166 12.083 12.0833 9.99967 12.0833C7.91634 12.0833 7.08301 10.4166 7.08301 10.4166"
                                        stroke="#101E10"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="bevel"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div>
                            {activeTab == "chat" ? <Chatbox /> : ""}

                            {activeTab == "livedrops" ? <LiveDrops /> : ""}
                        </div>
                    </aside>
                </div>

                <main
                    className={`w-auto  px-5 ${sideBar ? "lg:ml-[280px]" : ""}`}
                >
                    {children}
                </main>
            </div>

            <Footer />
        </>
    );
}
