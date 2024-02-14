import "./bootstrap";
import "../css/app.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { inertiaTitle } from "inertia-title";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./Components/ui/toaster";

const queryClient = new QueryClient();

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

inertiaTitle();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <QueryClientProvider client={queryClient}>
                    <App {...props} />
                    <Toaster />
                </QueryClientProvider>
            </>
        );
    },
    progress: {
        color: "#00C74D",
    },
});
