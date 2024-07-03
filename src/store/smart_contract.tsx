"use client";

import { create } from "zustand";
import { SmartContract } from "@/lib/smart-contract";

import { Balance } from "@/lib/hooks/useBalance";
import { Loading } from "@/components/Loading";

type State = {
  client?: SmartContract;
  balance: Balance;
};
type Action = {
  setClient: (client: SmartContract) => void;
  setBalance: (balance: Balance) => void;
};

export const useProgramStore = create<State & Action>((set) => ({
  balance: { amount: 0, loading: <Loading text="Loading" /> },
  setClient: (client: SmartContract) => set((state) => ({ ...state, client })),
  setBalance: (balance: Balance) => set((state) => ({ ...state, balance })),
}));
