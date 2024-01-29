import successSound_ from "@/Sounds/success.mp3";
import errorSound_ from "@/Sounds/error.mp3";
import clickSound_ from "@/Sounds/mouse-click.mp3";
import gameOverSound_ from "@/Sounds/game-over.mp3";
import sound from "@/Libs/sound";

const clickSound = () => sound({ audio: clickSound_ }).play();
const successSound = () => sound({ audio: successSound_ }).play();
const errorSound = () => sound({ audio: errorSound_ }).play();
const gameOverSound = () => sound({ audio: gameOverSound_, volume: 1 }).play();

export { clickSound, successSound, errorSound, gameOverSound };
