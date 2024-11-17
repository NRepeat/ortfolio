import { type HubConnection } from "@microsoft/signalr";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type MessageType = {
  uid: string;
  value: string;
  time: string;
};
export type UserType = {
  uid: string;
  name: string;
};
export type State = {
  connection: HubConnection | null;
  loading: boolean;
  chatRoom: string | null;
  messages: MessageType[];
  user: UserType | null;
  roomId: string | null;
};

export type Actions = {
  setConnection: (connection: HubConnection) => void;
  setLoading: (loading: boolean) => void;
  setChatRoom: (chatRoom: string) => void;
  setChatMessages: (messages: MessageType[]) => void;
  setChatMessage: (messages: MessageType) => void;
  setChatUser: (user: UserType) => void;
  setRoomIdUser: (roomId: string) => void;
  clearChatState: () => void;
};

const initialState = {
  connection: null,
  loading: false,
  chatRoom: null,
  messages: [],
  user: null,
  roomId: null,
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
      setChatUser: (user) =>
        set((state) => {
          state.user = user;
        }),
      setRoomIdUser: (roomId) =>
        set((state) => {
          state.roomId = roomId;
        }),
      clearChatState: () =>
        set((state) => {
          // (Object.keys(initialState) as (keyof State)[]).forEach((key) => {
          //   state[key] = initialState[key] as never;
          // });
          state.connection = null;
          state.chatRoom = null;
          state.user = null;
          state.messages = [];
        }),
      ...initialState,
    })),
    {
      name: "chat",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
