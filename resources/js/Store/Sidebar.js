import { update } from "lodash";
import { create } from "zustand";

export const useSideBarStore = create((set) => ({
    chats: [],
    setChats: (newChat) =>
        set((state) => ({
            // Use slice to keep the latest 100 chats
            chats:
                state.chats.length > 200
                    ? [...state.chats.slice(100), newChat]
                    : [...state.chats, newChat],
        })),

    activeTab: "chat",
    setActiveTab: (tab) => {
        set(() => ({
            activeTab: tab,
        }));
    },
}));
