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
            <div className="w-full md:p-5 md:py-10 grid place-items-center Tower-bg min-h-64">
                {state.showPlane ? (
                    <Plane isMovingDown={state.isMovingDown} />
                ) : (
                    ""
                )}
            </div>
            <div className="flex items-center gap-2 mt-5">
                <Input
                    label="bet amount"
                    prefix="$"
                    allowClear={false}
                    className="flex gap-1  items-center "
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
                    {[
                        { mul: 1, label: "+1", mode: "plus" },
                        { mul: 5, label: "+5", mode: "plus" },
                        { mul: 10, label: "+10", mode: "plus" },
                        { mul: 25, label: "+25", mode: "plus" },
                        { mul: 0.5, label: "1/2" },
                        { mul: 2, label: "2x" },
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
                                    return alert.error("Insufficient balance");
                                }

                                if (bet >= 0) {
                                    setState((pre) => ({
                                        ...pre,
                                        bet: parseInt(bet),
                                    }));
                                }
                            }}
                        >
                            {o.label}
                        </MultiplierButton>
                    ))}

                    <MultiplierButton
                        onClick={(e) => {
                            setState((pre) => ({
                                ...pre,
                                bet: balance,
                            }));
                        }}
                    >
                        max
                    </MultiplierButton>
                </Input>
                {state.cashOut ? (
                    <PrimaryButton
                        className="w-full max-w-xs -mb-6"
                        disabled={state.betDisabled}
                        onClick={cashOut}
                    >
                        {parseInt(state.bet) +
                            parseInt(state.bet) * state.multiplier}
                        {"cashout "}
                    </PrimaryButton>
                ) : (
                    <PrimaryButton
                        className="w-full max-w-xs -mb-6"
                        disabled={state.betDisabled}
                        onClick={placeBet}
                    >
                        {state.connection == "connecting"
                            ? "connecting..."
                            : "Place bet"}
                    </PrimaryButton>
                )}
            </div>
        </GameLayout>
    );
}
