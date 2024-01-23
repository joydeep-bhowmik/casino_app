import Block from "@/Components/Games/Keno/Block";
import Gem from "@/Components/Games/Keno/Gem";
import Red from "@/Components/Games/Keno/Red";
import Green from "@/Components/Games/Keno/Green";
import GameLayout from "@/Layouts/GameLayout";
import { useAlert } from "react-alert";
import { useStore } from "@/Store/main";
import Input from "@/Components/Games/Input";
import MultiplierButton from "@/Components/Games/MultiplierButton";
import { useEffect, useState } from "react";
import Select from "@/Components/Games/Select";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Keno() {
    const alert = useAlert();
    const updateBalance = useStore((state) => state.updateBalance);
    const balance = useStore((state) => state.balance);
    const roundId = useStore((state) => state.roundId);
    const updateRoundId = useStore((state) => state.updateRoundId);

    const initialTiles = Array.from({ length: 40 }, (_, index) => ({
        number: index + 1,
        type: "block",
    }));

    const [state, setState] = useState({
        tiles: initialTiles,
        betDisabled: true,
        connection: "connecting",
        bet: "",
        risk: "low",
        gridLocked: true,
    });

    const resetBlocks = () => {
        setState((pre) => ({
            ...pre,
            tiles: initialTiles,
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
            tiles[i].type = mines.includes(i) ? "red" : "gem";
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
            return alert.error("Insufficient funds");
        }
        if (!["low", "medium", "high"].includes(state.risk)) {
            return alert.error("Invalid risk");
        }
        send_message({ type: "start", bet: state.bet, risk: state.risk });
    };

    const conn = new WebSocket(socket("/keno?token=" + get_user_token()));

    conn.onmessage = (res) => {
        res = res.data;
        res = JSON.parse(res);
        console.log("recieved : ", res);

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
                disabled: true,
                gridLocked: false,
                betDisabled: true,
            }));

            return alert.success(res.success.message);
        }

        if (res.block) {
            change_block({ type: res.block.type, number: res.block.number });
        }

        if (res.finished) {
            updateBalance();
            alert.success(res.finished);

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
            }));
        };
    }, []);

    return (
        <GameLayout title="Keno">
            <div className="w-full md:p-5 md:py-10 grid place-items-center keno-bg">
                <div className="w-full grid grid-cols-8 gap-3 max-w-lg">
                    {state.tiles.map((i) => {
                        const type = i.type;
                        var block = "";
                        const className = "h-14 w-14";
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
