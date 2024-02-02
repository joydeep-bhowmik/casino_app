import { SpinItems } from "@/Components/SpinItems";
import GameLayout from "@/Layouts/GameLayout";
import { useState, forwardRef, useMemo } from "react";
import Input from "@/Components/Games/Input";
import MultiplierButton from "@/Components/Games/MultiplierButton";
import { useStore } from "@/Store/main";
import { useAlert } from "react-alert";
import Section from "@/Components/Section";
import { useEffect, useRef } from "react";
import { successSound, errorSound, gameOverSound } from "@/Libs/sounds";

export default function index() {
    const alert = useAlert();
    const updateBalance = useStore((state) => state.updateBalance);
    const balance = useStore((state) => state.balance);
    const roundId = useStore((state) => state.roundId);
    const updateRoundId = useStore((state) => state.updateRoundId);
    const connRef = useRef(null);

    const [state, setState] = useState({
        bet: 0,
        betDisabled: true,
        connectionStatus: "connecting",
        spinning: false,
        targetId: null,
    });
    const [spin, setSpin] = useState(false);

    const items = [
        {
            id: "axe",
            image_url: "/assets/roll/axe.png",
        },
        {
            id: "tent",
            image_url: "/assets/roll/tent.png",
        },
        {
            id: "meat",
            image_url: "/assets/roll/meat.png",
        },
    ];

    const item_keys = useMemo(() => items.map((item) => item.id), []);

    const axeItem = items.find((item) => item.id == "axe");
    const meatItem = items.find((item) => item.id == "meat");
    const tentItem = items.find((item) => item.id == "tent");

    const send_message = (json) => {
        console.log("sending : ", json);
        connRef.current.send(JSON.stringify(json));
    };

    const placeBet = (item) => {
        if (!item_keys.includes(item)) {
            errorSound();
            return alert.error("Invalid item");
        }

        if (state.bet > balance) {
            errorSound();
            return alert.error("Insufficient funds");
        }

        send_message({ type: "start", bet: state.bet, item: item });
    };

    useEffect(() => {
        connRef.current = new WebSocket(
            socket("/roll?token=" + get_user_token())
        );

        connRef.current.onopen = function (e) {
            setState((pre) => ({
                ...pre,
                connectionStatus: "open",
                betDisabled: false,
            }));
        };

        connRef.current.onmessage = (res) => {
            res = res.data;
            res = JSON.parse(res);
            console.log(res);
            if (res.error) {
                console.log(res.error);
                errorSound();
                return alert.error(res.error);
            }

            if (res.info) {
                errorSound();
                return alert.info(res.info);
            }

            if (res.success) {
                console.log(res.success);

                updateRoundId(res.success.round_id);

                setState((pre) => ({
                    ...pre,
                    betDisabled: true,
                    spinning: true,
                }));

                successSound();

                alert.success(res.success.message);

                setTimeout(() => {
                    setState((pre) => ({
                        ...pre,
                        betDisabled: false,
                        spinning: false,
                        targetId: res.success.result,
                    }));

                    if (res.success.status == "won") {
                        alert.success(res.success.payout + " points won");
                        successSound();
                    } else if (res.success.status == "lost") {
                        alert.info("Game over");
                        gameOverSound();
                    }
                    updateBalance(res.success.balance);
                }, 2000);
                return;
            }
        };

        connRef.current.onclose = function (e) {
            setState((pre) => ({
                ...pre,
                connectionStatus: "closed",
                betDisabled: true,
            }));
        };

        return () => {
            connRef.current.close();
        };
    }, []);

    return (
        <GameLayout title="Roll">
            <SpinItems
                items={items}
                spin={state.spinning}
                targetId={state.targetId}
                ItemComponent={Item}
                className="h-48"
            />
            <Input
                label="bet amount"
                prefix="$"
                allowClear={false}
                className="lg:grid lg:grid-cols-[auto_auto] gap-2 w-full "
                inputClassName=""
                value={state.bet}
                onChange={(e) => {
                    let value = e.target.value;
                    if (value > balance) {
                        alert.info("Insufficient balance");
                        return;
                    }
                    setState((pre) => ({
                        ...pre,
                        bet: value,
                    }));
                }}
            >
                {" "}
                <div className="flex flex-wrap lg:flex-nowrap gap-1 mt-5 lg:mt-0 md:flex-row ">
                    {[
                        { mul: 5, label: "+5", mode: "plus" },
                        { mul: 10, label: "+10", mode: "plus" },
                        { mul: 25, label: "+25", mode: "plus" },
                        { mul: 0.5, label: "1/2" },
                        { mul: 2, label: "2x" },
                        { mul: 1, label: "max", mode: "max" },
                    ].map((o, i) => (
                        <MultiplierButton
                            key={i}
                            onClick={() => {
                                setState((pre) => ({
                                    ...pre,
                                    bet:
                                        o.mode == "max"
                                            ? balance
                                            : o.mode == "plus"
                                            ? parseInt(pre.bet) +
                                              parseInt(o.mul)
                                            : parseInt(pre.bet) *
                                              parseInt(o.mul),
                                }));
                            }}
                            className="lg:w-full"
                        >
                            {o.label}
                        </MultiplierButton>
                    ))}
                </div>
            </Input>

            <div className="lg:columns-3 space-y-5 py-5">
                <Section>
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-center gap-4">
                            <img
                                src={url(tentItem.image_url)}
                                alt=""
                                className="rounded-full h-16 w-16"
                            />
                            <h2 className="font-bold text-xl">Win 14x</h2>
                        </div>

                        <button
                            disabled={state.betDisabled}
                            onClick={() => placeBet("tent")}
                            className="bg-[#00C74D] font-semibold tracking-wider p-3 rounded"
                        >
                            Place bet
                        </button>
                    </div>
                </Section>

                <Section>
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-center gap-4">
                            <img
                                src={url(meatItem.image_url)}
                                alt=""
                                className="rounded-full h-16 w-16"
                            />
                            <h2 className="font-bold text-xl">Win 2x</h2>
                        </div>

                        <button
                            disabled={state.betDisabled}
                            onClick={() => placeBet("meat")}
                            className="bg-[#DE4C41] font-semibold tracking-wider p-3 rounded"
                        >
                            Place bet
                        </button>
                    </div>
                </Section>

                <Section>
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-center gap-4">
                            <img
                                src={url(axeItem.image_url)}
                                alt=""
                                className="rounded-full h-16 w-16"
                            />
                            <h2 className="font-bold text-xl">Win 2x</h2>
                        </div>

                        <button
                            disabled={state.betDisabled}
                            onClick={() => placeBet("axe")}
                            className="bg-[#373737] font-semibold tracking-wider p-3 rounded"
                        >
                            Place bet
                        </button>
                    </div>
                </Section>
            </div>
        </GameLayout>
    );
}

const Item = forwardRef(function (
    { item, spinning = false, dummy = false },
    ref
) {
    return (
        <div
            className={
                "h-20 flex-shrink-0 overflow-hidden" +
                " " +
                (spinning ? "animate-scroll-left" : "")
            }
            ref={ref}
        >
            <img
                src={url(item.image_url)}
                alt=""
                className="object-contain h-full"
            />
        </div>
    );
});
