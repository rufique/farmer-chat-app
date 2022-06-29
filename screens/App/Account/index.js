import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  Pressable,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { useSelector } from "react-redux";
import { useGetUserProfileQuery } from "../../../services/authService/auth.service";
import { useGetUserAddressesQuery } from "../../../services/addressService/address.service";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PROFILE_LIST = [
  {
    title: "Stall Listing",
    icon: <MaterialCommunityIcons name="home-group" size={24} />,
    link: "Addresses",
  },
  {
    title: "Orders",
    icon: <MaterialCommunityIcons name="format-list-checks" size={24} />,
    link: "Orders",
  },
  {
    title: "Settings",
    icon: <MaterialCommunityIcons name="cog" size={24} />,
  },
];

const Account = () => {
  const { user } = useSelector((state) => state.authReducer);
  const { navigate } = useNavigation();
  const { colors } = useTheme();
  const {
    data: userInfo,
    isloading,
    error,
  } = useGetUserProfileQuery(user?.sub);
  const {
    data: addresses,
    isLoading: loadingAddress,
    error: addressError,
    refetch,
  } = useGetUserAddressesQuery(user?.sub + "?address_type=home", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  

  return (
    <Box backgroundColor={colors.white} flex={1}>
      <Box p={4}>
        <HStack>
          <HStack flex={1} space={4} alignItems="center">
            <Center>
                <Avatar size={12} />
            </Center>
            <VStack>
              <Text textTransform="capitalize" fontWeight="bold" fontSize="16">
                {userInfo?.firstname} {userInfo?.lastname}
              </Text>
              <Text>{user.username}</Text>
              <Text>{!!user && user?.roles.join(" ")}</Text>
            </VStack>
          </HStack>
          <Center>
            <Button variant="ghost" onPress={() => navigate("EditAccount")}>
              Edit
            </Button>
          </Center>
        </HStack>
      </Box>
      <Box px={4} py={2}>
        {!loadingAddress && !!addresses && addresses.length > 0 && (
          <VStack>
            <Text color="dark.400">
              {addresses[0].address}, {addresses[0].city}
            </Text>
          </VStack>
        )}
      </Box>
      <Box mt={4} px={4} py={2}>
        {PROFILE_LIST.map((item, index) => (
          <ListItem
            key={index}
            title={item.title}
            icon={item.icon}
            onPress={() => (item?.link ? navigate(item.link) : false)}
          />
        ))}
      </Box>
    </Box>
  );
};

const ListItem = ({ title, icon, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <HStack alignItems="center" py={4}>
        <HStack space={4} flex={1}>
          {icon}
          <Text fontSize="16">{title}</Text>
        </HStack>
        <MaterialCommunityIcons name="chevron-right" size={24} />
      </HStack>
    </Pressable>
  );
};

export default Account;
