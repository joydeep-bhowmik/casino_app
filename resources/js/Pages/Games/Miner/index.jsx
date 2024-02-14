import React, { useEffect, useMemo, useState } from "react";
import GameLayout from "@/Layouts/GameLayout";
import Input from "@/Components/Games/Input";
import MultiplierButton from "@/Components/Games/MultiplierButton";
import PrimaryButton from "@/Components/PrimaryButton";
import SmallMine from "./SmallMine";
import SmallGem from "./SmallGem";
import Block from "./Block";
import RedMine from "./RedMine";
import DarkGem from "./DarkGem";
import { useStore } from "@/Store/main";
import {
    clickSound,
    gameOverSound,
    successSound,
    errorSound,
} from "@/Libs/sounds";
import { socket, url } from "@/Libs/urls.js";
import { useRef } from "react";
import { useToast } from "@/Components/ui/use-toast";

export default function Miner({}) {
    const { toast } = useToast();
    const connRef = useRef(null);
    const { updateBalance, balance, roundId, updateRoundId, settings } =
        useStore((state) => state);

    const initialTiles = Array.from({ length: 25 }, (_, index) => ({
        number: index + 1,
        type: "block",
    }));

    const [state, setState] = useState({
        tiles: initialTiles,
        disabled: true,
        connection: "connecting",
        mines: "",
        gems: "",
        bet: "",
        gridLocked: true,
    });

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

    const resetTiles = () => {
        setState((pre) => ({
            ...pre,
            tiles: initialTiles,
        }));
    };

    const placeBet = () => {
        resetTiles();
        if (!state.bet) {
            return showInfo("Enter bet ammount");
        }
        if (!state.mines) {
            return showInfo("Enter number of mines");
        }
        updateBalance(balance - state.bet);
        send_message({
            type: "start",
            bet: state.bet,
            mines: state.mines,
        });
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

    const showAll = (mines) => {
        let tiles = [...initialTiles]; // Create a copy of initialTiles

        for (let i = 0; i < tiles.length; i++) {
            tiles[i] = { ...tiles[i], number: i + 1 };
            tiles[i].type = mines.includes(i + 1) ? "mine" : "gem";
        }

        console.log(tiles);

        setState((prevState) => ({
            ...prevState,
            tiles: tiles,
            disabled: false,
            gridLocked: true,
        }));
    };

    const handleMessage = function (res) {
        res = JSON.parse(res.data);
        console.log(res, state);

        if (res.error) {
            return showError(res.error);
        }

        if (res.info) {
            return showInfo(res.info);
        }

        if (res.success) {
            settings.sound && successSound();
            updateRoundId(res.success);

            setState((pre) => ({
                ...pre,
                disabled: true,
                gridLocked: false,
            }));
            return;
        }
        if (res.block) {
            change_block({ type: res.block.type, number: res.block.number });

            if (res.block.type === "mine") {
                updateBalance();
                settings.sound && gameOverSound();
                toast({
                    title: "Game Over",
                    description: `${res.block.payout} points collected`,
                });

                setTimeout(() => {
                    showAll(res.block.reveal_mines);
                }, 300);

                return;
            }
            settings.sound && successSound();
        }
    };

    const send_message = (props) => {
        settings.sound && clickSound();

        const msg = JSON.stringify(props);
        connRef.current.send(msg);
    };

    useEffect(() => {
        connRef.current && connRef.current.close();

        const conn = new WebSocket(socket("/miner?token=" + get_user_token()));
        conn.onmessage = handleMessage;

        conn.onopen = function (e) {
            setState((prev) => ({
                ...prev,
                connected: true,
            }));
            setTimeout(() => {
                setState((prev) => ({
                    ...prev,
                    showSpinner: true,
                    disabled: false,
                    connection: "connected",
                }));
            }, 3000);
        };

        connRef.current = conn;

        return () => {
            connRef.current.close();
        };
    }, []);

    return (
        <GameLayout title="Miner">
            <div className="flex gap-5 md:flex-row  flex-col-reverse">
                <div className="bg-[#111] rounded-md md:max-w-sm w-full">
                    <div className="flex font-bold border-b border-b-slate-900">
                        <button className="p-3 w-full border-b">Manual</button>
                        <button className="p-3 w-full ">Auto</button>
                    </div>

                    <div className="p-5 flex flex-col gap-5 h-[90%]">
                        <Input
                            label="bet amount"
                            prefix="$"
                            allowClear={false}
                            className="flex gap-2 flex-wrap lg:flex-nowrap items-center "
                            inputClassName=""
                            value={state.bet}
                            onChange={(e) => {
                                let value = e.target.value;
                                if (value > balance) {
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

                        <Input
                            type="number"
                            className="bg-[#333] rounded-md"
                            label="Miner"
                            value={state.mines}
                            onChange={(e) => {
                                let value = e.target.value;
                                console.log(value, value < 20);
                                if (value <= 20) {
                                    return setState((pre) => ({
                                        ...pre,
                                        mines: value,
                                    }));
                                }
                                return showError("Invalid mines");
                            }}
                            prefix={<SmallMine />}
                        ></Input>

                        <Input
                            type="number"
                            className="bg-[#333] rounded-md"
                            label="Gems"
                            value={state.tiles.length - state.mines}
                            disabled={true}
                            prefix={<SmallGem />}
                        ></Input>

                        <PrimaryButton
                            className="mt-auto"
                            disabled={state.disabled}
                            onClick={placeBet}
                        >
                            Place Bet
                        </PrimaryButton>
                    </div>
                </div>
                <div
                    style={{
                        background: `url(${url("/assets/img/minerbg.png")})`,
                    }}
                    className="w-full md:p-5 md:py-10 grid place-items-center"
                >
                    <div
                        className="w-full s grid grid-cols-5 p-3 gap-4 max-w-md !opacity-100"
                        disabled={state.gridLocked}
                    >
                        {state.tiles.map((i) => {
                            const type = i.type;
                            var block = "";
                            switch (type) {
                                case "mine":
                                    block = <RedMine />;
                                    break;
                                case "gem":
                                    block = <DarkGem />;
                                    break;

                                default:
                                    block = <Block />;
                            }

                            return (
                                <button
                                    onClick={() => {
                                        send_message({
                                            type: "check",
                                            number: i.number,
                                            round_id: roundId,
                                        });
                                    }}
                                    key={i.number}
                                    disabled={state.gridLocked}
                                    className="!opacity-100 w-16 h-16 mt-3"
                                >
                                    {block}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </GameLayout>
    );
}
