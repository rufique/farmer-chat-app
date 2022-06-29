import ChatInput from "./Components/ChatInput";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import moment from "moment";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { submitMessage } from "../../featured/chat/chat.slice";
import { reformatChatTopic } from "../../utils";
import { Box, HStack, useTheme, VStack } from "native-base";


const MessageSchema = Yup.object().shape({
  message: Yup.string().required(),
  chatId: Yup.number().required(),
  userId: Yup.number().required(),
  receiver: Yup.string().required(),
});

const DEFAULT_INPUT_HEIGHT = 50;

const Chat = () => {
  const dispatch = useDispatch();
  let [inputHeight, setInputHeight] = useState(DEFAULT_INPUT_HEIGHT);
  let [message, setMessage] = useState("");
  const { chats } = useSelector((state) => state.chatReducer);
  let [chat, updateChats] = useState({
    messages: [],
  });
  const { user } = useSelector((state) => state.authReducer);
  const { params } = useRoute();
  const { colors, fontSizes } = useTheme();

  useEffect(() => {
    updateChatThread();
  }, [params, chats]);

  const updateChatThread = React.useCallback(() => {
    const topic = reformatChatTopic(params?.topic);
    const chat = chats.find(
      (chat) => chat.topic === params?.topic || chat.topic === topic
    );
    updateChats({...chat});
  }, [params, chats]);

  const handleOnSendMessage = async () => {
    const newMessage = {
      message,
      chatId: chat?.id,
      userId: user.sub,
      receiver: params?.receiver?.username,
      topic: chat?.topic
    };
    try {
      await MessageSchema.validate(newMessage);
      //if(!isValid) { throw new Error("Cannot send to this chat"); }
      dispatch(submitMessage(newMessage));
      setMessage("");
      setInputHeight(setInputHeight);
    } catch (e) {
      ToastAndroid.show(e.message, ToastAndroid.LONG);
    }
  };

  const handleOnChangeMessage = (val) => {
    setMessage(val);
  };

  return (
    <View style={{ position: "relative", flex: 1 }}>
      {(!chat?.messages || chat?.messages.length === 0) && (
        <Box w={'100%'}>
          <VStack justifyContent="center" space={2} alignItems="center" margin={4} borderRadius={16} padding={5} bgColor={colors.primary[100]}>
            <Text allowFontScaling style={{ fontSize: fontSizes.lg }} >No messages in this chat</Text>
            <Text>You messages will appear here</Text>
          </VStack>
        </Box>
      )}
      <ChatsWrapper
        receiver={params?.receiver}
        messages={chat?.messages}
        user={user}
        inputHeight={inputHeight}
      />
      <ChatInput
        value={message}
        inputHeight={inputHeight}
        handleOnSendMessage={handleOnSendMessage}
        handleOnChangeMessage={handleOnChangeMessage}
        setInputHeight={setInputHeight}
      />
    </View>
  );
};

const ChatsWrapper = React.memo(({ messages, user, inputHeight }) => {
  const { colors } = useTheme();
  const scrollViewRef = React.useRef();
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: Math.max(50, inputHeight) + 24,
      }}
      ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
    >
      {messages &&
        messages.length > 0 &&
        messages.map((message, idx) => {
          let isOwner = message.userId === user.sub;
          let messageBoxVars = {
            position: isOwner ? "right" : "left",
            backgroundColor: isOwner ? colors.primary[300] : colors.primary[100],
          };
          return (
            <MessageBox position={messageBoxVars.position} key={idx}>
              <View
                style={{
                  padding: 8,
                  paddingHorizontal: 12,
                  backgroundColor: messageBoxVars.backgroundColor,
                  borderRadius: 5,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    color: "#34a474",
                    alignSelf: "flex-end",
                  }}
                >
                  {moment(message?.createdAt).format("LLL")}
                </Text>
                <Text>{message.message}</Text>
              </View>
            </MessageBox>
          );
        })}
    </ScrollView>
  );
});

const MessageBox = ({ children, position = "right" }) => {
  return (
    <TouchableOpacity
      activeOpacity={.8}
      style={{
        flexDirection: "row",
        justifyContent: position === "right" ? "flex-end" : "flex-start",
        alignItems: "center",
      }}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Chat;
