import Block from "./Block";
import Red from "./Red";
import Green from "./Green";
import GameLayout from "@/Layouts/GameLayout";
import { useStore } from "@/Store/main";
import Input from "@/Components/Games/Input";
import MultiplierButton from "@/Components/Games/MultiplierButton";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import { socket, url } from "@/Libs/urls.js";
import { useRef } from "react";
import { useToast } from "@/Components/ui/use-toast";
import {
    clickSound,
    gameOverSound,
    successSound,
    errorSound,
} from "@/Libs/sounds";

export default function Tower() {
    const balance = useStore((state) => state.balance);
    const roundId = useStore((state) => state.roundId);
    const updateRoundId = useStore((state) => state.updateRoundId);
    const settings = useStore((state) => state.settings);
    const connRef = useRef(null);
    const { toast } = useToast();

    const initialTiles = Array.from({ length: 27 }, (_, index) => ({
        number: 27 - index,
        type: "block",
    }));

    const [state, setState] = useState({
        tiles: initialTiles,
        betDisabled: true,
        connection: "connecting",
        bet: 0,
        risk: "low",
        gridLocked: true,
    });

    const resetBlocks = () => {
        setState((pre) => ({
            ...pre,
            tiles: initialTiles,
        }));
    };

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

    const change_block = ({ number, type }) => {
        // Find the index of the tile in the state.tiles array
        const tileIndex = state.tiles.findIndex((t) => t.number === number);

        if (tileIndex !== -1) {
            // Create a new array to avoid mutating the state directly
            const updatedTiles = [...state.tiles];

            // Update the type of the found tile
            updatedTiles[tileIndex].type = type;

            // Update the state with the new tiles array
            setState((pre) => ({
                ...pre,
                tiles: updatedTiles,
            }));
        } else {
            console.log(`Tile ${number} not found`);
        }
    };

    //modify
    const showAll = (mines) => {
        let tiles = [...initialTiles]; // Create a copy of initialTiles

        for (let i = 0; i < tiles.length; i++) {
            tiles[i] = { ...tiles[i], number: i };
            tiles[i].type = mines.includes(i) ? "green" : "red";
        }

        setState((prevState) => ({
            ...prevState,
            tiles: tiles,
            disabled: false,
            gridLocked: true,
        }));
    };

    const placeBet = () => {
        resetBlocks();

        if (state.bet > balance) {
            return showError("Insufficient funds");
        }
        send_message({ type: "start", bet: state.bet });
    };

    const handleMessage = (res) => {
        res = res.data;
        res = JSON.parse(res);

        if (res.error) {
            return showError(res.error);
        }

        if (res.info) {
            return showInfo(res.info);
        }

        if (res.success) {
            updateRoundId(res.success.round_id);
            settings.sound && successSound();
            setState((pre) => ({
                ...pre,
                betDisabled: true,
                disabled: true,
                gridLocked: false,
            }));

            return;
        }

        if (res.block) {
            change_block({ type: res.block.type, number: res.block.number });

            if (res.block.type == "red") {
                setState((pre) => ({
                    ...pre,
                    betDisabled: false,
                    disabled: false,
                    gridLocked: false,
                }));
                settings.sound && gameOverSound();
                return showInfo("Game over");
            }
        }

        if (res.finished) {
            settings.sound && gameOverSound();
            return showInfo(res.finished);
        }
    };

    const send_message = (json) => {
        settings.sound && clickSound();
        connRef.current.send(JSON.stringify(json));
    };

    useEffect(() => {
        const conn = new WebSocket(socket("/tower?token=" + get_user_token()));
        conn.onmessage = handleMessage;
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
            }));
        };
        connRef.current = conn;

        return () => {
            connRef.current.close();
        };
    }, []);

    return (
        <GameLayout title="Tower">
            <div
                className="w-full md:p-5 md:py-10 grid place-items-center tower-bg backdrop-opacity-50"
                style={{
                    background: `url(${url(
                        `/assets/img/towerbg.png`
                    )}), lightgray 50% / cover`,
                    backgroundSize: "cover",
                }}
            >
                <div className="bg p-1 lg:p-10 border-[20px] rounded border-[#1A1A1A]">
                    <div className="w-full grid grid-cols-3 gap-3 max-w-lg">
                        {state.tiles.map((i) => {
                            const type = i.type;
                            var block = "";
                            const className = "w-full border";
                            switch (type) {
                                case "red":
                                    block = (
                                        <Red className={className}>
                                            {i.number}
                                        </Red>
                                    );
                                    break;
                                case "green":
                                    block = (
                                        <Green className={className}>
                                            {i.number}
                                        </Green>
                                    );
                                    break;
                                default:
                                    block = (
                                        <Block className={className}>
                                            {i.number}
                                        </Block>
                                    );
                            }

                            return (
                                <span
                                    onClick={() => {
                                        send_message({
                                            type: "check",
                                            number: i.number,
                                            round_id: roundId,
                                        });
                                    }}
                                    key={i.number}
                                    disabled={state.gridLocked}
                                >
                                    {block}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex items-center flex-col lg:flex-row gap-2 mt-5">
                <Input
                    label="bet amount"
                    prefix="$"
                    allowClear={false}
                    className="flex gap-1 flex-col lg:flex-row w-full"
                    inputClassName=""
                    value={state.bet}
                    onChange={(e) => {
                        let value = e.target.value;
                        if (value > balance) {
                            showInfo("Insufficient balance");
                            return;
                        }
                        setState((pre) => ({
                            ...pre,
                            bet: value,
                        }));
                    }}
                >
                    <div className="flex gap-1 flex-wrap items-center">
                        {[
                            { mul: 1, label: "+1", mode: "plus" },
                            { mul: 5, label: "+5", mode: "plus" },
                            { mul: 10, label: "+10", mode: "plus" },
                            { mul: 25, label: "+25", mode: "plus" },
                            { mul: 0.5, label: "1/2" },
                            { mul: 2, label: "2x" },
                        ].map((o) => (
                            <MultiplierButton
                                key={o.label}
                                onClick={(e) => {
                                    state.bet = parseFloat(state.bet, 10);
                                    o.mul = parseFloat(o.mul, 10);
                                    let bet = state.bet * o.mul;
                                    if (o.mode == "plus") {
                                        bet = state.bet + o.mul;
                                    }
                                    if (bet > balance) {
                                        return showError(
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
                    </div>
                </Input>

                <PrimaryButton
                    className="w-full max-w-xs -mb-6"
                    disabled={state.betDisabled}
                    onClick={placeBet}
                >
                    {state.connection == "connecting"
                        ? "connecting..."
                        : "Place bet"}
                </PrimaryButton>
            </div>
        </GameLayout>
    );
}
