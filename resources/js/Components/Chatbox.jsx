import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

export default function Chatbox() {
    const input = useRef(null);

    const [state, setState] = useState({
        status: "connecting",
        chats: [],
    });

    var conn = new WebSocket(socket("/chat?token=" + get_user_token()));

    console.log(conn);

    conn.onmessage = function (res) {
        console.log(res.data);
        return;
        res = JSON.parse(res.data);

        if (res.error) return alert(res.error);

        return;
        const newChat = res;
        setState((prevState) => ({
            ...prevState,
            chats: [...prevState.chats, newChat],
        }));
    };

    function send_message() {
        console.log(state, conn);
        const value = input.current.value;
        conn.send(value);
    }

    useEffect(() => {
        conn.onopen = function (e) {
            setState({ ...state, status: "connected" });
        };
    }, []);
    return (
        <>
            {state.chats.map((chat, i) => (
                <div key={i} className="text-white flex items-center gap-5">
                    {/* <img src={chat.user.avatar_url} /> */}
                    <div className="bg rounded-md">
                        <div>
                            <span className="font-bold">{chat.user.name}</span>
                            <span>{chat.time()}</span>
                        </div>
                        <div>{chat.text}</div>
                    </div>
                </div>
            ))}

            <div className="flex items-center bg rounded-md">
                <input
                    type="text"
                    className="bg-transparent !ring-0 !border-0"
                    placeholder={
                        state.status == "connecting"
                            ? "Connecting..."
                            : "Your message..."
                    }
                    disabled={state.status == "connecting"}
                    ref={input}
                />
                <button
                    className="text-white"
                    disabled={state.status == "connecting"}
                    onClick={send_message}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                    >
                        <path d="M3 12.9999H9V10.9999H3V1.84558C3 1.56944 3.22386 1.34558 3.5 1.34558C3.58425 1.34558 3.66714 1.36687 3.74096 1.40747L22.2034 11.5618C22.4454 11.6949 22.5337 11.9989 22.4006 12.2409C22.3549 12.324 22.2865 12.3924 22.2034 12.4381L3.74096 22.5924C3.499 22.7255 3.19497 22.6372 3.06189 22.3953C3.02129 22.3214 3 22.2386 3 22.1543V12.9999Z"></path>
                    </svg>
                </button>
            </div>
        </>
    );
}
