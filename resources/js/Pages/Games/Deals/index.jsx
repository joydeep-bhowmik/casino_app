import GameLayout from "@/Layouts/GameLayout";
import BrowseItems from "./BrowseItems";
import { socket, url } from "@/Libs/urls.js";
import PrimaryButton from "@/Components/PrimaryButton";
import Input from "@/Components/Input";
import MultiplierButton from "@/Components/Games/MultiplierButton";
import SecondaryButton from "@/Components/SecondaryButton";
import RetryIcon from "@/Components/Icons/RetryIcon";
import { useState } from "react";
import multipliers from "./mutlipliers";
import Wheel from "./Wheel";
import { useStore } from "@/Store/main";
import { useRef } from "react";
import { useEffect } from "react";
import { useToast } from "@/Components/ui/use-toast";
import {
    gameOverSound,
    errorSound,
    successSound,
    clickSound,
} from "@/Libs/sounds";

export default function index({ auth }) {
    const { updateBalance, balance, roundId, updateRoundId, settings } =
        useStore((state) => state);

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

    const [latestResponse, setLatestResponse] = useState(balance);

    const { toast } = useToast();
    const [connectionState, setConnectionState] = useState("connecting");
    const socketRef = useRef(null);

    const [product, setProduct] = useState({ price: 100 });
    const [spin, setSpin] = useState(false);
    const [result, setResult] = useState(false);

    const minChance = 2;
    const maxChance = 80;

    const maxPrice = (product.price * maxChance) / 100;
    const minPrice = (product.price * minChance) / 100;

    const [chance, setChance] = useState(minChance);
    const [range, setRange] = useState(0);
    const [price, setPrice] = useState(minPrice);

    const changeChance = (value) => {
        let chance = Math.min(value, maxChance);
        let price_ = (product.price * chance) / 100;
        price_ = Math.max(minPrice, price_);
        let range = (price_ / maxPrice) * 100;
        setChance(parseInt(chance));
        setRange(parseInt(range));
        setPrice(parseInt(price_));
    };

    const changeRange = (value) => {
        let range = Math.min(value, 100);
        let price_ = (maxPrice * range) / 100;
        price_ = Math.max(minPrice, price_);
        let chance = (price_ / product.price) * 100;
        setRange(parseInt(range));
        setPrice(parseInt(price_));
        setChance(parseInt(Math.min(chance, maxChance)));
    };

    const changePrice = (value) => {
        let price_ = Math.min(maxPrice, value);
        price_ = Math.max(minPrice, price_);
        let percentage = (price_ / maxPrice) * 100;
        let chance = (price_ / product.price) * 100;
        setPrice(parseInt(price_));
        setRange(parseInt(percentage));
        setChance(parseInt(Math.min(chance, maxChance)));
    };

    const handleSelect = (product) => {
        setProduct(product);
    };

    const placeBet = () => {
        send_message({ type: "start", chance: chance, product_id: product.id });
        settings.sound && clickSound();
    };

    const callBackOnSpinStop = () => {
        let response = latestResponse;
        updateBalance(response.data.balance);
        if (response.message) {
            toast({
                title: response.data.result ? "Win" : "Lost",
                description: response.message,
            });

            settings.sound && response.data.result
                ? successSound()
                : gameOverSound();
        }
    };

    const handleSocketMessage = (e) => {
        let data = false;
        let response = {};
        try {
            data = JSON.parse(e.data);
            response = data.response;
            console.log(data);
        } catch (error) {
            console.error(error);
        }
        if (!data || !response) return;

        switch (response.type) {
            case "success":
                updateRoundId(response.data.round_id);
                setSpin(response.data.round_id);
                setResult(response.data.result);
                setLatestResponse(response);

                break;

            case "error":
                errorSound();
                toast({
                    title: "! Error",
                    variant: "destructive",
                    description: response.message,
                });
                break;
        }
    };

    const send_message = (json) => {
        console.log("sending : ", json);

        socketRef.current.send(JSON.stringify(json));
    };

    useEffect(() => {
        const ws = new WebSocket(socket("/deals?token=" + get_user_token()));

        ws.onopen = () => {
            setConnectionState("connected");
        };

        ws.onmessage = handleSocketMessage;

        ws.onclose = () => {
            setConnectionState("disconnected");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setConnectionState("error");
        };

        socketRef.current = ws;
    }, []);
    return (
        <GameLayout title="Deals">
            <div className="flex md:flex-row  flex-col lg:flex-row-reverse w-full gap-5">
                <div className="w-full space-y-5 p-3 rounded-md bg">
                    <div className="relative lg:w-[80%] mx-auto w-full">
                        <Wheel
                            className={`w-full`}
                            percentage={chance}
                            spin={spin}
                            result={result}
                            callback={callBackOnSpinStop}
                        />
                        {product.image_url ? (
                            <div className="h-24 md:h-28  flex flex-col gap-3 justify-center text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="font-semibold">
                                    {product.name}
                                </div>
                                <div className="h-16 md:h-24">
                                    <img
                                        src={url(product.image_url)}
                                        alt=""
                                        className="object-contain h-full "
                                    />
                                </div>
                                <div>
                                    <div className="bg-[#0B0B0B] rounded-md p-2 font-semibold w-fit mx-auto">
                                        <span className="text-[#5AC35D] ">
                                            €
                                        </span>

                                        <span>{product.price}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                    <div className="flex gap-5 max-w-sm mx-auto h-12">
                        <PrimaryButton
                            className="text-black w-full"
                            onClick={placeBet}
                            disabled={!product.image_url}
                        >
                            Open Case
                        </PrimaryButton>
                        <SecondaryButton className="w-full text-gray-700 space-x-3">
                            <RetryIcon />
                            <span className="ml-5"> Try for free</span>
                        </SecondaryButton>
                    </div>

                    <div>
                        <Input
                            label="chance"
                            value={chance}
                            className="flex gap-2 flex-wrap w-full"
                            onChange={(e) => {
                                changeChance(e.target.value);
                            }}
                        >
                            <div className="flex gap-2 w-full">
                                {multipliers.map((o) => (
                                    <MultiplierButton
                                        className="w-full"
                                        onClick={() => {
                                            changeChance(o.percentage);
                                        }}
                                        key={o.label}
                                    >
                                        {o.label}
                                    </MultiplierButton>
                                ))}
                            </div>
                        </Input>

                        <div className="flex gap-2">
                            <Input
                                label="price"
                                prefix={<span className="ml-3 ">$</span>}
                                className="w-full "
                                value={price}
                                onChange={(e) => {
                                    changePrice(e.target.value);
                                }}
                            />

                            <Input
                                type="range"
                                label="price"
                                className="w-full h-10 accent-[#5AC35D]"
                                prefix={
                                    <span style={{ height: "38px" }}></span>
                                }
                                style={{ height: "3px" }}
                                value={range}
                                onChange={(e) => {
                                    changeRange(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-[320px]">
                    <BrowseItems
                        handleSelect={handleSelect}
                        product={product}
                    />
                </div>
            </div>
        </GameLayout>
    );
}
