import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    isEstablishingConnection: false,
    isConnected: false,
    connectedUsers: [],
    chats: [],
  },
  reducers: {
    startConnecting: (state) => {
      state.isEstablishingConnection = true;
    },
    startDisconnect: (state) => {
      state.isConnected = false;
      state.isEstablishingConnection = false;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
      state.isEstablishingConnection = true;
    },
    receiveAllMessages: (state, action) => {
      // if the chat is found.. update it, otherwise add to list
      state.chats = [action.payload.chats];
    },
    receiveMessage: (state, action) => {
      // first identify the chat
      // message comes from the server with chat id
      let chats = state.chats.map((chat) =>
        chat.id === action.payload?.message.chatId
          ? { ...chat, messages: [...chat.messages, action.payload.message] }
          : chat
      );
      state.chats = chats;
    },
    submitMessage: (state, action) => {
      return;
    },
    createChat: (state, action) => {
      return;
    },
  },
});
export const {
  startConnecting,
  startDisconnect,
  connectionEstablished,
  submitMessage,
  receiveMessage,
  receiveAllMessages,
  sendMessage,
  createChat,
} = chatSlice.actions;
export default chatSlice.reducer;
