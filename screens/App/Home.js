import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Box, Button, Divider, HStack, Icon, Stack, Text, useTheme, VStack } from "native-base";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { unsetCredentials } from "../../featured/auth/auth.slice";
import * as SecureStore from "expo-secure-store";
import { startDisconnect } from "../../featured/chat/chat.slice";

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer);
  const { reset, navigate } = useNavigation();
  const { colors } = useTheme()

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("farmers_app_token");
    dispatch(startDisconnect());
    dispatch(unsetCredentials());
    reset({
      index: 0,
      routes: [
        {
          name: "Login",
        },
      ],
    });
  };

  return (
    <Box
      px={4}
      alignItems="center"
      justifyContent="flex-start"
      safeAreaY
      height="100%"
    >
      <Stack space={2} flexDirection="column">
        <VStack space={2} mb={4} backgroundColor={colors.gray[200]} p={4}>
          <Text>You are currently logged in as:</Text>
          <Text>Username: {user.username}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Role: {!!user?.roles && user?.roles[0]}</Text>
        </VStack>
        <HStack space={2} justifyContent="center">
          <Button
            variant="ghost"
            onPress={() => navigate("ChatUsersList")}
            leftIcon={
              <Icon as={Ionicons} name="chatbox-ellipses-outline" size="sm" />
            }
          >
            Chat
          </Button>
          <Divider orientation="vertical" />
          <Button
            variant="ghost"
            onPress={() => navigate("AddAddress")}
            leftIcon={<Icon as={Ionicons} name="location-outline" size="sm" />}
          >
            Add Address on Map
          </Button>
          <Divider orientation="vertical" />
          <Button
            variant="ghost"
            onPress={handleLogout}
            leftIcon={<Icon as={Ionicons} name="exit-outline" size="sm" />}
          >
            Logout
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};

export default Home;
