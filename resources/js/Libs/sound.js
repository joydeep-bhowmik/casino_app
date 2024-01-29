export default function sound({ audio, volume = 0.2, currentTime = 0 }) {
    const sound_ = new Audio(audio);
    sound_.volume = 0.2;
    sound_.currentTime = 0;
    sound_.preload = "auto";
    return sound_;
}
