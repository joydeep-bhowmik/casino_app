import successSound_ from "@/Sounds/success.mp3";
import errorSound_ from "@/Sounds/error.mp3";
import clickSound_ from "@/Sounds/mouse-click.mp3";
import gameOverSound_ from "@/Sounds/game-over.mp3";
import planeFlyingSound_ from "@/Sounds/airplane-flying.mp3";
import crashSound_ from "@/Sounds/crash.mp3";
import sound from "@/Libs/sound";

export const clickSound = () => sound({ audio: clickSound_ }).play();
export const successSound = () => sound({ audio: successSound_ }).play();
export const errorSound = () => sound({ audio: errorSound_ }).play();
export const gameOverSound = () =>
    sound({ audio: gameOverSound_, volume: 1 }).play();
export const planeFlyingSound = () =>
    sound({ audio: planeFlyingSound_ }).play();
export const crashSound = () => sound({ audio: crashSound_ }).play();
