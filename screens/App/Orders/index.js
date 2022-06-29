import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Icon,
  Text,
  VStack,
} from "native-base";
import { Pressable } from "react-native";
import { useSelector } from "react-redux";
import { useGetUserOrdersQuery } from "../../../services/orderService/order.service";
import moment from "moment";

const Orders = () => {
  const { navigate } = useNavigation();
  const { user } = useSelector((state) => state.authReducer);
  const {
    data: orders,
    isLoading,
    error,
  } = useGetUserOrdersQuery(user?.sub, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const goToShop = () => {
    navigate("Shop");
  };

  return (
    <Box flex={1} backgroundColor="white" pb="90">
      {isLoading ? (
        <Center flex={1}>
          <Text>Loading orders...</Text>
        </Center>
      ) : !!error ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : (
        <Box>
          {/* id, total, status, createdAt */}
          <FlatList
            data={orders}
            keyExtractor={(item) => item?.id}
            ListEmptyComponent={
              <Center flex={1}>
                <VStack space={4} alignItems="center">
                  <Icon
                    as={MaterialCommunityIcons}
                    name="database-search"
                    size={24}
                    color="dark.600"
                  />
                  <Text>We could not find any orders for this account</Text>
                  {/* <Button onPress={goToShop}>Shop now</Button> */}
                </VStack>
              </Center>
            }
            renderItem={({ item, index }) => {
              return (
                <Pressable onPress={() => navigate('OrderDetails', { id: item.id })}>
                  <Box p={4} bgColor={index % 2 != 0 ? "dark.800" : "white"}>
                    <VStack>
                      <Text color="dark.500" fontSize="12">
                        {moment(item.createdAt).format("YY-MM-DD HH:mm")}
                      </Text>
                      <HStack>
                        <Text flex={1} fontWeight="bold">
                          {item?.orderRef}
                        </Text>
                        <Text fontWeight="bold">
                          MK{(+item?.orderTotal).toFixed(2)}
                        </Text>
                      </HStack>
                      <Text fontWeight="bold">{item?.orderStatus}</Text>
                    </VStack>
                  </Box>
                </Pressable>
              );
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Orders;
