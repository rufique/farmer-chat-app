import React from "react";
import { InputField } from "../../../components/Forms";
import styled from "styled-components";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

function ChatInput({
  inputHeight,
  setInputHeight,
  handleOnSendMessage,
  handleOnChangeMessage,
  value
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 16,
      }}
    >
      <View
        style={{
          justifyContent: "flex-start",
          flexDirection: "row",
          alignItems: "flex-end",
          backgroundColor: "#e4e4e4",
          borderWidth: 0.5,
          borderColor: "#d4d4d4",
          borderRadius: 25,
          paddingRight: 4,
          paddingBottom: 4,
        }}
      >
        <InputField
          placeholder="Type here"
          multiline
          style={{
            height: Math.max(50, inputHeight),
            fontSize: 16,
          }}
          value={value}
          onContentSizeChange={(event) => {
            let currentHeight = event.nativeEvent.contentSize.height;
            if (currentHeight > 200) currentHeight = 200;
            setInputHeight(currentHeight);
          }}
          onChangeText={handleOnChangeMessage}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            height: 50 - 4,
            width: 50 - 4,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
          }}
          disabled={!value}
          onPress={handleOnSendMessage}
        >
          <Feather name="send" size={24} color="#434744" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default React.memo(ChatInput);
