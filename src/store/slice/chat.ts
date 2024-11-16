import { type HubConnection } from "@microsoft/signalr";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type State = {
  connection: HubConnection | null;
  loading: boolean;
  chatRoom: string | null;
  messages: string[];
};

export type Actions = {
  setConnection: (connection: HubConnection) => void;
  setLoading: (loading: boolean) => void;
  setChatRoom: (chatRoom: string) => void;
  setChatMessages: (messages: string[]) => void;
  setChatMessage: (messages: string) => void;
  clearChatState: () => void;
};

const initialState = {
  connection: null,
  loading: false,
  chatRoom: null,
  messages: [],
};
export const useChatStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      setConnection: (connection: HubConnection) =>
        set((state) => {
          state.connection = connection;
        }),
      setLoading: (loading: boolean) =>
        set((state) => {
          state.loading = loading;
        }),
      setChatRoom: (chatRoom: string) =>
        set((state) => {
          state.chatRoom = chatRoom;
        }),
      setChatMessages: (messages) =>
        set((state) => {
          state.messages = messages;
        }),
      setChatMessage: (message) =>
        set((state) => {
          state.messages = [...state.messages, message];
        }),
      clearChatState: () =>
        set((state) => {
          (Object.keys(initialState) as (keyof State)[]).forEach((key) => {
            state[key] = initialState[key] as never;
          });
        }),
      ...initialState,
    })),
    {
      name: "chat",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
