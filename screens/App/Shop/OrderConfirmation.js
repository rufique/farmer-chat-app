import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, Button, Center, Text, VStack } from "native-base";
import { useGetOrderDetailsQuery } from "../../../services/orderService/order.service";
import OnlineShoppingSvg from "../../../assets/online_shopping.svg";

const OrderConfirmation = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();
  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(params?.id, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  console.log(error, params);

  const goToOrderTracker = () => {
    reset({
      index: 1,
      routes: [
        {
          name: "Shop",
        },
        { name: "OrderTracker", params: { id: order.id } },
      ],
    });
  };

  const goToShop = () => {
    reset({
      index: 0,
      routes: [
        {
          name: "Shop",
        },
      ],
    });
  };

  return (
    <Box backgroundColor="white" flex={1}>
      {isLoading ?
      <Center flex={1}>
        <Text>loading...</Text>
      </Center>
      : (
      <>
        <Center flex={1}>
          <Box w={200} h={200} borderRadius={360 / 2} bgColor="dark.600">
            <Center flex={1}>
              <OnlineShoppingSvg width={300} />
            </Center>
          </Box>
        </Center>

        <Box p={4} flex={1}>
          <Box p={4} flex={1}>
            <Center space={2}>
              <Text fontSize={22} fontWeight="bold">
                Order Successful
              </Text>
              <Text>Thank you!, your order has been succesful</Text>
              <Text mt={4} fontSize="16" fontWeight="bold">
                Order Total: MK{+order?.orderTotal}
              </Text>
            </Center>
          </Box>
          <VStack space={2}>
            <Button onPress={goToOrderTracker}>Track Order</Button>
            <Button bgColor="secondary" onPress={goToShop}>
              Shop again
            </Button>
          </VStack>
        </Box>
      </>
      )}
    </Box>
  );
};

export default OrderConfirmation;
