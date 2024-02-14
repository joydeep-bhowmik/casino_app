import GameLayout from "@/Layouts/GameLayout";
import { useToast } from "@/Components/ui/use-toast";
import { useStore } from "@/Store/main";
import Input from "@/Components/Games/Input";
import MultiplierButton from "@/Components/Games/MultiplierButton";
import { useEffect, useState, useRef } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Plane2 from "./Plane2";
import Multipliers from "./Multipliers";
import Times from "./Times";
import {
    crashSound,
    errorSound,
    planeFlyingSound,
    successSound,
} from "@/Libs/sounds";
import { socket, url } from "@/Libs/urls.js";

export default function Crash() {
    const { updateBalance, balance, roundId, updateRoundId, settings } =
        useStore((state) => state);
    const { toast } = useToast();

    const showError = (description) => {
        toast({
            title: "Error",
            description: description,
            variant: "destructive",
        });
        settings.sound && errorSound();
    };

    const showInfo = (description) => {
        toast({
            title: "Info",
            description: description,
        });
        settings.sound && errorSound();
    };

    const connRef = useRef(null);

    const initialState = {
        betDisabled: true,
        connection: "connecting",
        bet: 0,
        crashed: false,
        showPlane: false,
        cashOut: false,
        ping: false,
        multiplier: 0,
        cashOutAt: 0,
        second: 0,
    };

    const [state, setState] = useState(initialState);

    useEffect(() => {
        connRef.current = new WebSocket(
            socket("/crash?token=" + get_user_token())
        );

        connRef.current.onopen = function (e) {
            setState((pre) => ({
                ...pre,
                connection: "open",
                betDisabled: false,
            }));
        };

        connRef.current.onmessage = (res) => {
            res = res.data;
            res = JSON.parse(res);
            console.log(res);
            if (res.error) {
                return showError(res.error);
            }

            if (res.info) {
                return showInfo(res.info);
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

                return;
            }

            if (res.crash || res.cashout) {
                crashSound();
                setState((pre) => ({
                    ...pre,
                    betDisabled: false,
                    crashed: true,
                    cashOut: false,
                    ping: false,
                    multiplier: 0,
                    second: 0,
                }));

                setTimeout(() => {
                    setState((pre) => ({
                        ...pre,
                        crashed: false,
                        showPlane: false,
                    }));
                }, 2000);

                if (res.cashout) {
                    successSound();
                    updateBalance(res.cashout.balance);
                    return toast({
                        title: "Cashout successfull",
                        description: res.cashout.message,
                    });
                }
                return showInfo("Crashed");
            }
        };

        connRef.current.onclose = function (e) {
            setState((pre) => ({
                ...pre,
                connection: "closed",
                betDisabled: true,
                ping: false,
            }));
        };

        return () => {
            connRef.current.close();
        };
    }, []);

    const send_message = (json) => {
        console.log("sending : ", json);
        connRef.current.send(JSON.stringify(json));
    };

    const placeBet = () => {
        if (state.bet > balance) {
            errorSound();
            return showError("Insufficient funds");
        }
        successSound();
        planeFlyingSound();
        send_message({ type: "start", bet: state.bet });
    };

    const cashOut = () => {
        send_message({ type: "cashout", round_id: roundId });
    };

    useEffect(() => {
        let intervalId;

        if (state.ping) {
            intervalId = setInterval(() => {
                send_message({
                    type: "check",
                    number: state.multiplier,
                    round_id: roundId,
                });
                setState((pre) => ({
                    ...pre,
                    multiplier: pre.multiplier + 0.1,
                    second: pre.second + 1,
                }));
            }, 1000);
        }

        if (state.cashOutAt && state.multiplier >= state.cashOutAt) {
            cashOut();
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [state.ping, state.multiplier]);

    return (
        <GameLayout title="Crash">
            <div
                style={{
                    background: `url(${url(
                        `/assets/img/crashbg.png?aaa`
                    )}), lightgray 50% / cover`,
                    backgroundSize: "cover",
                }}
                className="w-full relative flex items-center  h-[180px] md:h-[290px] lg:h-[400px] "
            >
                {state.showPlane ? (
                    <div className="absolute inset-0 w-full h-full">
                        <Plane2 crash={state.crashed} />
                    </div>
                ) : (
                    ""
                )}

                <div className="w-fit  absolute md:top-10 top-2 mx-auto left-0 right-0">
                    {state.multiplier !== 0 && (
                        <>
                            <div className="md:text-5xl text-xl text-green-500 font-bold text-center">
                                {state.multiplier.toFixed(1)}x
                            </div>
                            <div>Current payout</div>
                        </>
                    )}
                </div>
                <Times
                    value={state.second}
                    className=" w-full grid grid-flow-col auto-cols-[minmax(0,auto)] md:p-5  mt-auto "
                />
                <Multipliers
                    value={state.multiplier}
                    className=" grid grid-rows-auto  h-full place-items-center md:px-5 ml-auto "
                />
            </div>
            <div className="flex items-center gap-2 mt-5">
                <div className="w-full max-w-sm space-y-8">
                    <div>
                        <Input
                            label="auto-cashout"
                            prefix="$"
                            allowClear={false}
                            className="w-full flex flex-col md:flex-row gap-1"
                            inputClassName=""
                            value={state.cashOutAt}
                            onChange={(e) => {
                                const value = e.target.value;
                                setState((pre) => ({
                                    ...pre,
                                    cashOutAt: value,
                                }));
                            }}
                        >
                            <div className="flex gap-1 md:flex-row ">
                                {[
                                    { mul: 1, label: "+1" },
                                    { mul: 5, label: "+5" },
                                    { mul: 10, label: "+10" },
                                    { mul: 25, label: "+25" },
                                ].map((o, i) => (
                                    <MultiplierButton
                                        key={i}
                                        onClick={() => {
                                            const cashOutAt =
                                                state.cashOutAt + o.mul;
                                            setState((pre) => ({
                                                ...pre,
                                                cashOutAt:
                                                    cashOutAt >= 0
                                                        ? cashOutAt
                                                        : 0,
                                            }));
                                        }}
                                        className="w-full"
                                    >
                                        {o.label}
                                    </MultiplierButton>
                                ))}
                            </div>
                        </Input>
                    </div>
                    <Input
                        label="bet amount"
                        prefix="$"
                        className="w-full "
                        inputClassName=""
                        value={state.bet}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value > balance) {
                                showInfo("Insufficient balance");
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
                            { mul: 1, label: "+1" },
                            { mul: 5, label: "+5" },
                            { mul: 10, label: "+10" },
                            { mul: 25, label: "+25" },
                        ].map((o, i) => (
                            <MultiplierButton
                                key={i}
                                onClick={() => {
                                    const bet = state.bet + o.mul;
                                    if (bet > balance) {
                                        showError("Insufficient balance");
                                        return;
                                    }
                                    setState((pre) => ({
                                        ...pre,
                                        bet: bet >= 0 ? bet : 0,
                                    }));
                                }}
                                className="w-full"
                            >
                                {o.label}
                            </MultiplierButton>
                        ))}
                    </div>

                    {state.cashOut ? (
                        <PrimaryButton
                            className="w-full !text-black"
                            onClick={cashOut}
                        >
                            {(
                                parseFloat(state.bet) +
                                parseFloat(state.bet) *
                                    parseFloat(state.multiplier)
                            ).toFixed(1)}{" "}
                            cashout
                        </PrimaryButton>
                    ) : (
                        <PrimaryButton
                            className="w-full !text-black"
                            disabled={state.betDisabled}
                            onClick={placeBet}
                        >
                            {state.connection === "connecting"
                                ? "connecting..."
                                : "Place bet"}
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </GameLayout>
    );
}
