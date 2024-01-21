import React, { useEffect, useState } from "react";
import Input from "@/Components/Games/Input";
import MultiplierButton from "@/Components/Games/MultiplierButton";
import GameLayout from "@/Layouts/GameLayout";
import SmallMine from "@/Components/Games/Miner/SmallMine";
import SmallGem from "@/Components/Games/Miner/SmallGem";
import PrimaryButton from "@/Components/PrimaryButton";
import Block from "@/Components/Games/Miner/Block";
import RedMine from "@/Components/Games/Miner/RedMine";
import DarkGem from "@/Components/Games/Miner/DarkGem";
import { useAlert } from "react-alert";
import { useStore } from "@/Store/main";

export default function Miner({}) {
    const alert = useAlert();

    const updateBalance = useStore((state) => state.updateBalance);
    const balance = useStore((state) => state.balance);
    const roundId = useStore((state) => state.roundId);
    const updateRoundId = useStore((state) => state.updateRoundId);

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
    console.log("Current state:", state);

    const resetTiles = () => {
        setState((pre) => ({
            ...pre,
            tiles: initialTiles,
        }));
    };

    const placeBet = () => {
        resetTiles();
        if (!state.bet) {
            return alert.info("Enter bid ammount");
        }
        if (!state.mines) {
            return alert.info("Enter number of mines");
        }
        updateBalance(balance - state.bet);
        send_message({
            type: "start",
            bid: state.bet,
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
            tiles[i] = { ...tiles[i], number: i };
            tiles[i].type = mines.includes(i) ? "mine" : "gem";
        }

        setState((prevState) => ({
            ...prevState,
            tiles: tiles,
            disabled: false,
            gridLocked: true,
        }));
    };

    const conn = new WebSocket(socket("/miner?token=" + get_user_token()));

    conn.onmessage = function (res) {
        res = JSON.parse(res.data);
        console.log(res, state);
        if (res.error) {
            return alert.error(res.error);
        }
        if (res.info) {
            return alert.info(res.info);
        }
        if (res.success) {
            updateRoundId(res.success);

            setState((pre) => ({
                ...pre,
                disabled: true,
                gridLocked: false,
            }));
            return alert.success("Started");
        }
        if (res.block) {
            change_block({ type: res.block.type, number: res.block.number });

            if (res.block.type === "mine") {
                updateBalance();

                alert.info("Game Over");

                setTimeout(() => {
                    showAll(res.block.reveal_mines);
                }, 500);

                return;
            }
        }
    };

    const send_message = (props) => {
        console.log(props);
        const msg = JSON.stringify(props);
        conn.send(msg);
    };

    useEffect(() => {
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
                            className="flex gap-2  items-center "
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
                                return alert.error("Invalid mines");
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
                    <div className="w-full grid grid-cols-5 gap-4 max-w-md">
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
