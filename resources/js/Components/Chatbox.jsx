import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { socket, url } from "@/Libs/urls";
import { debounce } from "lodash";
import { useSideBarStore } from "@/Store/Sidebar";

export default function Chatbox() {
    const connRef = useRef(null);
    const isHovering = useRef(false);
    const chatScrollRef = useRef(null);
    const inputRef = useRef(null);
    const [connStatus, setConnStatus] = useState(null);
    const { chats, setChats } = useSideBarStore((state) => state);

    const [retry, setRetry] = useState(0);

    const handleMessage = (e) => {
        let res;

        try {
            res = JSON.parse(e.data);
        } catch (error) {
            console.error(error);
            return;
        }
        if (res.error) return alert(res.error);

        const newChat = res;

        setChats(newChat);
        scrollToBotom();
    };

    const scrollToBotom = (delay = 500) => {
        if (isHovering.current) return;

        setTimeout(function () {
            let container = chatScrollRef.current;
            container?.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }, delay);
    };
    const send_message = () => {
        const text = inputRef.current.value;

        if (text.length) connRef.current.send(text.substring(0, 100));

        inputRef.current.value = "";
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            send_message();
        }
    };

    useEffect(() => {
        if (connRef.current) return;
        const conn = new WebSocket(socket("/chat?token=" + get_user_token()));
        conn.onmessage = handleMessage;

        conn.onopen = function (e) {
            setConnStatus(true);
        };
        conn.onclose = function (e) {
            setConnStatus(false);
        };

        connRef.current = conn;

        scrollToBotom(0);

        // let inertval = setInterval(() => {
        //     connRef.current.send("test");
        // }, 1000);

        return () => {
            connRef.current.close();
        };
    }, [retry]);

    return (
        <>
            <div
                className="overflow-y-auto  custom-scrollbar h-[75vh] lg:h-80 space-y-3 my-3 p-2 max-w-full"
                ref={chatScrollRef}
                onMouseEnter={() => (isHovering.current = true)}
                onMouseLeave={() => (isHovering.current = false)}
            >
                {chats.map((chat, i) => (
                    <ChatBubble key={i} chat={chat} />
                ))}
            </div>

            <div className="flex items-center bg rounded-md ">
                <input
                    type="text"
                    className="bg-transparent !ring-0 !border-0 w-full"
                    placeholder={
                        connStatus === null
                            ? "Connecting..."
                            : connStatus === false
                            ? "Connection Closed"
                            : "your message..."
                    }
                    disabled={!connStatus}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                />
                <button
                    className="text-white ml-auto mr-2"
                    disabled={connStatus === null}
                    onClick={
                        connStatus === false
                            ? () => {
                                  setRetry((pre) => ++pre);
                              }
                            : send_message
                    }
                >
                    {connStatus === false ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                        >
                            <path d="M3 12.9999H9V10.9999H3V1.84558C3 1.56944 3.22386 1.34558 3.5 1.34558C3.58425 1.34558 3.66714 1.36687 3.74096 1.40747L22.2034 11.5618C22.4454 11.6949 22.5337 11.9989 22.4006 12.2409C22.3549 12.324 22.2865 12.3924 22.2034 12.4381L3.74096 22.5924C3.499 22.7255 3.19497 22.6372 3.06189 22.3953C3.02129 22.3214 3 22.2386 3 22.1543V12.9999Z"></path>
                        </svg>
                    )}
                </button>
            </div>
        </>
    );
}

function ChatBubble({ chat }) {
    return (
        <div className="flex items-center gap-2.5 w-full">
            <img
                className="w-8 h-8 rounded-full"
                src={url("/storage/avatars/" + chat.user.avatar)}
                alt="Jese image"
            />
            <div className="flex flex-col w-[85%] leading-1.5 p-4  bg rounded-xl">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold ">
                        {chat.user.name}
                    </span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {chat.time}
                    </span>
                </div>
                <div className="text-sm font-normal py-2.5  break-words">
                    {chat.text}
                </div>
            </div>
        </div>
    );
}
