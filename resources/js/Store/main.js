import axios from "axios";
import { create } from "zustand";

export const useStore = create((set) => ({
    balance: 0,
    roundId: null,
    updateBalance: (balance = null) => {
        if (balance) {
            set({ balance: balance });
        } else {
            axios.post(url("/user-balance")).then((res) => {
                if (res.data) {
                    set({ balance: res.data });
                }
            });
        }
    },
}));
