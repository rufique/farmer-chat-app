import { io } from "socket.io-client";
import ChatEvent from "./chatEvents";
import {
  startConnecting,
  startDisconnect,
  submitMessage,
  connectionEstablished,
  receiveAllMessages,
  receiveMessage,
  createChat,
} from "./chat.slice";
import { API_URL } from "../../contants";

const chatMiddleware = (store) => {
  let socket;
  return (next) => (action) => {
    const isConnectionEstablished = socket && store.getState().chatReducer.isConnected;
    const auth = store.getState().authReducer;

    if (startConnecting.match(action)) {
        
      socket = io(API_URL, {
        withCredentials: true,
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          },
        },
      });

      socket.on("connect", () => {
        store.dispatch(connectionEstablished());
        socket.emit(ChatEvent.RequestAllMessages);
      });

      socket.on(ChatEvent.SendAllMessages, (messages) => {
        store.dispatch(receiveAllMessages({ messages }));
      });

      socket.on(ChatEvent.ReceiveAllMessages, (messages) => {
        store.dispatch(receiveAllMessages({ chats: messages }));
      });

      socket.on(ChatEvent.UserConnected, (message) => {
       // we'll do something to show users online here...
      })

      socket.on(ChatEvent.ReceiveMessage, (message) => {
        store.dispatch(receiveMessage({ message }));
      });
    }

    if (submitMessage.match(action) && isConnectionEstablished) {
      socket.emit(ChatEvent.SendMessage, action.payload);
    }

    if(createChat.match(action) && isConnectionEstablished) {
      socket.emit(ChatEvent.CreateChat, action.payload);
    }

    if(startDisconnect.match(action)) {
      socket.close()
    }
    next(action);
  };
};

export default chatMiddleware;
