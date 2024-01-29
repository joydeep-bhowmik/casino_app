export default function cn(classes) {
    if (typeof classes == "string") {
        return classes;
    }
    if (typeof classes == "array") {
        return classes.join(" ");
    }
}
