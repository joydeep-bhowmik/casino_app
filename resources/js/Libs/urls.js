function prefixRoute(path) {
    let route = path.startsWith("/") ? path : "/" + path;
    return route;
}

export const url = (path, prefix = "") => {
    path = prefixRoute(path);
    let url = import.meta.env.DEV
        ? "http://127.0.0.1:8000"
        : import.meta.env.VITE_APP_URL;
    return url + prefix + path;
};
export const api = (path) => {
    return url(path, "/api");
};

export const socket = (path) => {
    return `ws://${import.meta.env.VITE_PUSHER_HOST}:${
        import.meta.env.VITE_PUSHER_PORT
    }${path}`;
};
