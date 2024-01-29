export default function cn(classes) {
    if (typeof classes == "string") {
        return classes;
    }
    if (typeof classes == "object") {
        return classes.join(" ");
    }
}
