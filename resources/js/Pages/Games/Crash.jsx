import GameLayout from "@/Layouts/GameLayout";
import { useAlert } from "react-alert";
import { useStore } from "@/Store/main";
import Input from "@/Components/Games/Input";
import MultiplierButton from "@/Components/Games/MultiplierButton";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Plane from "@/Components/Games/Crash/Plane";

export default function Tower() {
    const alert = useAlert();
    const updateBalance = useStore((state) => state.updateBalance);
    const balance = useStore((state) => state.balance);
    const roundId = useStore((state) => state.roundId);
    const updateRoundId = useStore((state) => state.updateRoundId);

    const [state, setState] = useState({
        betDisabled: true,
        connection: "connecting",
        bet: 0,
        isMovingDown: false,
        showPlane: false,
        cashOut: false,
        ping: false,
        multiplier: 0,
        cashOutAt: 0,
    });

    const placeBet = () => {
        if (state.bet > balance) {
            return alert.error("Insufficient funds");
        }

        send_message({ type: "start", bet: state.bet });
    };

    const cashOut = () => {
        send_message({ type: "cashout", round_id: roundId });
    };

    const conn = new WebSocket(socket("/crash?token=" + get_user_token()));

    conn.onmessage = (res) => {
        res = res.data;
        res = JSON.parse(res);
        console.log(res);
        if (res.error) {
            return alert.error(res.error);
        }

        if (res.info) {
            return alert.info(res.info);
        }

        if (res.success) {
            updateRoundId(res.success.round_id);

            setState((pre) => ({
                ...pre,
                betDisabled: true,
                cashOut: true,
                showPlane: true,
                ping: true,
            }));
            alert.success(res.success.message);

            return;
        }

        if (res.crash || res.cashout) {
            setState((pre) => ({
                ...pre,
                betDisabled: false,
                isMovingDown: true,
                cashOut: false,
                ping: false,
            }));

            setTimeout(() => {
                setState((pre) => ({
                    ...pre,
                    isMovingDown: false,
                    showPlane: false,
                }));
            }, 2000);

            if (res.cashout) {
                return alert.success("Cashout successfull");
            }
            return alert.info("Crashed");
        }
    };

    const send_message = (json) => {
        console.log("sending : ", json);
        conn.send(JSON.stringify(json));
    };

    useEffect(() => {
        conn.onopen = function (e) {
            setState((pre) => ({
                ...pre,
                connection: "open",
                betDisabled: false,
            }));
        };

        conn.onclose = function (e) {
            setState((pre) => ({
                ...pre,
                connection: "closed",
                betDisabled: true,
                ping: false,
            }));
        };

        let intervalId;

        if (state.ping) {
            let multiplier = 0;
            intervalId = setInterval(() => {
                multiplier = multiplier + 0.1;
                if (state.cashOutAt != 0 && multiplier >= state.cashOutAt) {
                    return cashOut();
                }
                setState((pre) => ({ ...pre, multiplier: multiplier }));
                send_message({
                    type: "check",
                    number: multiplier,
                    round_id: roundId,
                });
            }, 1000);
        }

        // Clear interval when shouldClearInterval becomes true
        if (!state.ping && intervalId) {
            clearInterval(intervalId);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [state.ping]);

    return (
        <GameLayout title="Crash">
            <div className="w-full relative md:p-5 md:py-10 grid place-items-center Tower-bg min-h-[500px]">
                {state.showPlane ? (
                    <Plane isMovingDown={state.isMovingDown} />
                ) : (
                    ""
                )}
                <div className="text-5xl w-fit font-bold absolute top-10 mx-auto left-0 right-0">
                    {state.multiplier !== 0 ? state.multiplier.toFixed(1) : 0}
                    {"x"}
                </div>
                <div
                    className="absolute top-0 left-0 right-0 bottom-0 h-full w-full opacity-50"
                    style={{
                        background: `url(${url(
                            `/assets/img/crashbg.jpg`
                        )}), lightgray 50% / cover`,
                        backgroundSize: "cover",
                    }}
                ></div>
            </div>
            <div className="flex items-center gap-2 mt-5">
                <div className="w-full max-w-sm space-y-8">
                    <div>
                        <Input
                            label="auto-cashout"
                            prefix="$"
                            allowClear={false}
                            className="w-full flex items-center gap-1"
                            inputClassName="w-[100px]"
                            value={state.cashOutAt}
                            onChange={(e) => {
                                let value = e.target.value;
                                setState((pre) => ({
                                    ...pre,
                                    cashOutAt: value,
                                }));
                            }}
                        >
                            {[
                                { mul: 1, label: "+1", mode: "plus" },
                                { mul: 5, label: "+5", mode: "plus" },
                                { mul: 10, label: "+10", mode: "plus" },
                                { mul: 25, label: "+25", mode: "plus" },
                            ].map((o, i) => (
                                <MultiplierButton
                                    key={i}
                                    onClick={(e) => {
                                        state.cashOutAt = parseFloat(
                                            state.cashOutAt,
                                            10
                                        );
                                        o.mul = parseFloat(o.mul, 10);
                                        let cashOutAt = state.cashOutAt * o.mul;
                                        if (o.mode == "plus") {
                                            cashOutAt = state.cashOutAt + o.mul;
                                        }

                                        if (cashOutAt >= 0) {
                                            setState((pre) => ({
                                                ...pre,
                                                cashOutAt: parseInt(cashOutAt),
                                            }));
                                        }
                                    }}
                                    className="w-full"
                                >
                                    {o.label}
                                </MultiplierButton>
                            ))}
                        </Input>
                    </div>
                    <Input
                        label="bet amount"
                        prefix="$"
                        allowClear={false}
                        className="w-full "
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
                    />
                    <div className="flex gap-2 items-center">
                        {[
                            { mul: 1, label: "+1", mode: "plus" },
                            { mul: 5, label: "+5", mode: "plus" },
                            { mul: 10, label: "+10", mode: "plus" },
                            { mul: 25, label: "+25", mode: "plus" },
                        ].map((o, i) => (
                            <MultiplierButton
                                key={i}
                                onClick={(e) => {
                                    state.bet = parseFloat(state.bet, 10);
                                    o.mul = parseFloat(o.mul, 10);
                                    let bet = state.bet * o.mul;
                                    if (o.mode == "plus") {
                                        bet = state.bet + o.mul;
                                    }
                                    if (bet > balance) {
                                        return alert.error(
                                            "Insufficient balance"
                                        );
                                    }

                                    if (bet >= 0) {
                                        setState((pre) => ({
                                            ...pre,
                                            bet: parseInt(bet),
                                        }));
                                    }
                                }}
                                className="w-full"
                            >
                                {o.label}
                            </MultiplierButton>
                        ))}
                    </div>

                    {state.cashOut ? (
                        <PrimaryButton
                            className="w-full"
                            disabled={state.betDisabled}
                            onClick={cashOut}
                        >
                            {(
                                parseFloat(state.bet) +
                                parseFloat(state.bet) *
                                    parseFloat(state.multiplier)
                            ).toFixed(1)}{" "}
                            {/* Rounding to 1 decimal place */}
                            {" cashout "}
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton
                            className="w-full "
                            disabled={state.betDisabled}
                            onClick={placeBet}
                        >
                            {state.connection == "connecting"
                                ? "connecting..."
                                : "Place bet"}
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </GameLayout>
    );
}
