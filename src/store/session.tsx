import { Session } from "@/session";
import { create } from "zustand";

type State = {
  session: Session | null;
};
type Action = {
  setSession: (session: Session | null) => void;
};

export const useSessionStore = create<State & Action>((set) => ({
  session: null,
  setSession: (session: Session | null) => set(() => ({ session })),
}));
