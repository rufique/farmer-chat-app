import { useNavigation } from "@react-navigation/native";
import {
  Avatar,
  Box,
  FlatList,
  Divider,
  Text,
  HStack,
  VStack,
  useTheme,
  Pressable,
  Actionsheet,
} from "native-base";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetTrackerQuery } from "../../services/chatService/chat.service";
import { createChat } from "../../featured/chat/chat.slice";
import { getInititals } from "../../utils";

const ChatUsersList = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { user } = useSelector((state) => state.authReducer);
  const [selectedUser, updateSelectedUser] = React.useState(false);
  const { data, isLoading, refetch } = useGetTrackerQuery({
    refetchOnFocus: true,
  });
  const theme = useTheme();

  React.useEffect(() => {
    refetch();
    return () => refetch();
  }, []);

  const createChatWithUser = (receiver) => {
    const chat = {
      users: [user.sub, receiver?.id],
      topic: `${user.username},${receiver?.username}`,
    };
    dispatch(createChat(chat));
    navigate("Chat", { topic: chat.topic, receiver });
  };

  return (
    <Box>
      {isLoading ? null : (
        <FlatList
          data={(!!user && 'roles'in user) && user?.roles[0] === "tracker" ? data?.users : [data?.users]}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => createChatWithUser(item)}
              onLongPress={() => {
                //alert('LngP! --------------------------------')
                updateSelectedUser(item);
              }}
            >
              <Box bgColor={theme.colors.light[50]} mb={0.5}>
                <HStack
                  space={3}
                  justifyContent="flex-start"
                  alignItems="center"
                  padding={4}
                >
                  <Avatar size={12} bgColor={theme.colors.primary[300]}>
                    {getInititals(`${item?.firstname} ${item?.lastname}`)}
                  </Avatar>
                  <VStack>
                    <Text textTransform="capitalize">
                      {item?.firstname} {item?.lastname}
                    </Text>
                    <Text fontSize={11}>{item?.username}</Text>
                  </VStack>
                </HStack>
              </Box>
            </Pressable>
          )}
        />
      )}
      <Actionsheet
        isOpen={!!selectedUser}
        onClose={() => updateSelectedUser(false)}
      >
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center">
            <Text
              fontSize="16"
              color="gray.500"
              _dark={{
                color: "gray.300",
              }}
              textTransform="capitalize"
            >
              {selectedUser?.firstname} {selectedUser?.lastname}
            </Text>
            <Divider/>
          </Box>
          <Actionsheet.Item
            onPress={() => alert("Deleting " + selectedUser.id)}
            //color={theme.colors.error[500]}
          >
            Delete
          </Actionsheet.Item>
          <Actionsheet.Item onPress={() => updateSelectedUser(false)}>
            Cancel
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};

export default ChatUsersList;
