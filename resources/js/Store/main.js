import axios from "axios";
import { create } from "zustand";
import { api, url } from "@/Libs/urls.js";
import { cashSound } from "@/Libs/sounds";
import { getCookie, setCookie } from "@/Libs/cookies";

export const useStore = create((set) => ({
    balance: 0,
    updating_balance: false,
    roundId: null,
    updateRoundId: (id) => {
        set({ roundId: id });
    },
    addBalace: (amount = null) => {
        set({ updating_balance: true });
        axios
            .post(url("/add-user-balance"))
            .then((res) => {
                set({ balance: res.data });
            })
            .catch((error) => console.error(error))
            .finally(() => {
                set({ updating_balance: false });
            });
    },
    updateBalance: (balance = null) => {
        if (balance) {
            set({ balance: balance });
            cashSound();
        } else {
            set({ updating_balance: true });
            axios
                .post(url("/user-balance"))
                .then((res) => {
                    if (res.data) {
                        set({ balance: res.data });
                    }
                })
                .finally(() => {
                    set({ updating_balance: false });
                });
        }
    },
    settings: JSON.parse(getCookie("settings")) || { sound: false },

    updateSettings: (newSettings) => {
        set({ settings: newSettings });
        setCookie("settings", JSON.stringify(newSettings), 30);
    },
    games: [],
    setGames: (games) => {
        set((state) => ({
            games: [...new Set([...state.games, ...games])],
        }));
    },
}));
