import axios from "axios";
import { create } from "zustand";

export const useStore = create((set) => ({
    balance: 0,
    updating_balance: false,
    roundId: null,
    updateRoundId: (id) => {
        set({ roundId: id });
    },
    updateBalance: (balance = null) => {
        if (balance) {
            set({ balance: balance });
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
}));
