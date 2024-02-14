import GameLayout from "@/Layouts/GameLayout";
import Block from "./Block";
import Gem from "./Gem";
import Red from "./Red";
import Green from "./Green";
import { useStore } from "@/Store/main";
import Input from "@/Components/Games/Input";
import MultiplierButton from "@/Components/Games/MultiplierButton";
import { useEffect, useState } from "react";
import Select from "@/Components/Games/Select";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    clickSound,
    gameOverSound,
    successSound,
    errorSound,
} from "@/Libs/sounds";
import { socket, url } from "@/Libs/urls.js";
import { useToast } from "@/Components/ui/use-toast";
import { useRef } from "react";

export default function Keno() {
    const { toast } = useToast();
    const connRef = useRef(null);
    const updateBalance = useStore((state) => state.updateBalance);
    const balance = useStore((state) => state.balance);
    const roundId = useStore((state) => state.roundId);
    const updateRoundId = useStore((state) => state.updateRoundId);

    const settings = useStore((state) => state.settings);

    const initialTiles = Array.from({ length: 40 }, (_, index) => ({
        number: index + 1,
        type: "block",
    }));
    const showError = (description) =>
        toast({
            title: "Error",
            description: description,
            variant: "destructive",
        });

    const showInfo = (description) =>
        toast({
            title: "Info",
            description: description,
        });

    const [state, setState] = useState({
        tiles: initialTiles,
        betDisabled: true,
        connection: "connecting",
        bet: "",
        risk: "low",
        gridLocked: true,
        diamonds: [],
    });

    const resetBlocks = () => {
        setState((pre) => ({
            ...pre,
            tiles: initialTiles,
            diamonds: [],
        }));
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
                diamonds:
                    type == "gem"
                        ? [...pre.diamonds, number]
                        : [...pre.diamonds],
            }));
        } else {
            console.log(`Tile ${number} not found`);
        }
    };

    //modify
    // const showAll = (mines) => {
    //     let tiles = [...initialTiles]; // Create a copy of initialTiles

    //     for (let i = 0; i < tiles.length; i++) {
    //         tiles[i] = { ...tiles[i], number: i };
    //         tiles[i].type = mines.includes(i) ? "red" : "gem";
    //     }

    //     setState((prevState) => ({
    //         ...prevState,
    //         tiles: tiles,
    //         disabled: false,
    //         gridLocked: true,
    //     }));
    // };

    const placeBet = () => {
        resetBlocks();
        if (!state.bet) {
            settings.sound && errorSound();
            return showError("Invalid bet amount");
        }

        if (state.bet > balance) {
            settings.sound && errorSound();
            return showError("Insufficient funds");
        }
        if (!["low", "medium", "high"].includes(state.risk)) {
            settings.sound && errorSound();
            return showError("Invalid risk");
        }
        send_message({ type: "start", bet: state.bet, risk: state.risk });
    };

    const handleMessage = (res) => {
        res = res.data;
        res = JSON.parse(res);
        console.log("recieved : ", res);

        if (res.error) {
            settings.sound && errorSound();
            return showError(res.error);
        }

        if (res.info) {
            settings.sound && errorSound();
            return showInfo(res.info);
        }

        if (res.success) {
            settings.sound && successSound();
            updateRoundId(res.success.round_id);

            setState((pre) => ({
                ...pre,
                disabled: true,
                gridLocked: false,
                betDisabled: true,
            }));

            return;
        }

        if (res.block) {
            change_block({ type: res.block.type, number: res.block.number });
            if (res.block.type == "gem") settings.sound && successSound();
        }

        if (res.finished) {
            settings.sound && gameOverSound();
            updateBalance(res.finished.balance);
            toast({
                title: res.finished.message,
                description: `${res.finished.payout} points collected`,
            });

            setTimeout(() => {
                setState((pre) => ({
                    ...pre,
                    tiles: initialTiles,
                    betDisabled: false,
                }));
            }, 2000);

            return;
        }
    };

    const send_message = (json) => {
        settings.sound && clickSound();
        connRef.current.send(JSON.stringify(json));
    };

    useEffect(() => {
        const conn = new WebSocket(socket("/keno?token=" + get_user_token()));
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
        <GameLayout title="Keno">
            <div className="w-full p-3 md:py-10 lg:grid grid-cols-[auto_auto_auto] place-items-center keno-bg relative">
                <div className="text-center font-bold space-y-5 min-w-10">
                    <span className="text-white text-sm ">Diamonds</span>
                    <div
                        className=" lg:w-10 lg:h-10 h-6 w-6 mx-auto"
                        style={{
                            backgroundImage: `url(${url(
                                "/assets/img/gem.png"
                            )})`,
                            backgroundSize: "cover",
                        }}
                    ></div>
                    <span>{state.diamonds.length ?? ""}x</span>
                </div>
                <div className="w-full grid grid-cols-8 gap-3 max-w-lg mt-5 lg:mt-0">
                    {state.tiles.map((i) => {
                        const type = i.type;
                        var block = "";
                        const className = "lg:h-14 lg:w-14 w-8 h-8";
                        switch (type) {
                            case "red":
                                block = (
                                    <Red className={className}>{i.number}</Red>
                                );
                                break;
                            case "gem":
                                block = (
                                    <Gem className={className}>{i.number}</Gem>
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
            <div className="flex items-center lg:flex-row flex-col gap-2 mt-5">
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
                            showInfo("Insufficient balance");
                            return;
                        }
                        setState((pre) => ({
                            ...pre,
                            bet: value,
                        }));
                    }}
                >
                    <MultiplierButton
                        onClick={(e) => {
                            let bet = state.bet / 2;
                            if (bet >= 0) {
                                setState((pre) => ({
                                    ...pre,
                                    bet: bet,
                                }));
                            }
                        }}
                    >
                        1/2
                    </MultiplierButton>
                    <MultiplierButton
                        onClick={(e) => {
                            let bet = state.bet * 2;
                            if (bet <= balance) {
                                setState((pre) => ({
                                    ...pre,
                                    bet: bet,
                                }));
                            }
                        }}
                    >
                        2x
                    </MultiplierButton>
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

                <Select
                    label="Risk"
                    value={state.risk}
                    onChange={(e) => {
                        setState((pre) => ({
                            ...pre,
                            risk: e.target.value,
                        }));
                    }}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </Select>

                <PrimaryButton
                    className="w-full -mb-6"
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
