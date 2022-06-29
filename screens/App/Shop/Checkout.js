import {
  Box,
  Button,
  Center,
  Container,
  FlatList,
  HStack,
  Icon,
  IconButton,
  Skeleton,
  Text,
  useTheme,
  VStack,
} from "native-base";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { updateCart } from "../../../featured/cart/cart.slice";
import { useGetUserAddressesQuery } from "../../../services/addressService/address.service";
import { useCreateOrderMutation } from "../../../services/orderService/order.service";
import { ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Cart = () => {
  const { cart, shippingAddress, shippingCost } = useSelector(
    (state) => state.cartReducer
  );
  const { user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const { navigate } = useNavigation()
  const { colors } = useTheme();
  const [cartTotal, updateCartTotal] = React.useState(0);

  const {
    data: addresses,
    isLoading,
    error,
    refetch,
  } = useGetUserAddressesQuery(user?.sub + "?address_type=stall", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [createOrder, { isLoading: isCreating },] = useCreateOrderMutation();

  const handleCreateOrder = async () => {
    try {
      let products = cart.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
      }));
      let values = {
        products,
        locationId: addresses[0].id,
        retailerId: user?.sub,
      };
      let result = await createOrder(values).unwrap();
      dispatch(updateCart([]));
      navigate('OrderConfirmation', { id: result?.id });
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  React.useEffect(() => {
    let cartTotal = cart.reduce(
      (acc, cur) => (acc += +cur.price * +cur.quantity),
      0
    );
    updateCartTotal(cartTotal);
  }, [cart]);

  React.useEffect(() => {}, [isLoading]);

  return (
    <Box backgroundColor={colors.white} flex={1}>
      <Box flex={5} p={4}>
        <Text fontSize={16} fontWeight="bold">
          Delivery Address
        </Text>
        {isLoading ? (
          <Skeleton></Skeleton>
        ) : (
          <HStack
            space={4}
            mt={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <HStack space={4}>
              <Center w="50" h="50" borderRadius="8" bgColor="dark.700">
                <Icon
                  as={MaterialIcons}
                  name="location-pin"
                  size={8}
                  color="dark.500"
                />
              </Center>
              <VStack>
                <Text fontWeight="bold">{addresses[0]?.address}</Text>
                <Text color="dark.500">{addresses[0]?.city}</Text>
              </VStack>
            </HStack>
            <Icon
              as={MaterialCommunityIcons}
              name="chevron-right"
              size={8}
              color="dark.300"
            />
          </HStack>
        )}
      </Box>
      <Box p={4} flex={1}>
        <Box flex={1} borderRadius="4">
          <HStack py={4} px={2} justifyContent="space-between">
            <Text>Cart Total</Text>
            <Text fontWeight="bold">MK{cartTotal}</Text>
          </HStack>
          <HStack px={4} mt={4} w="100%">
            <Button flex={1} onPress={handleCreateOrder} disabled={isCreating} isLoading={isCreating}>
              Place order now
            </Button>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

const CartItem = ({ item, addToCart, removeFromCart, subtractFromCart }) => {
  const { colors } = useTheme();
  return (
    <Box padding={4}>
      <HStack>
        <Center w={"60"} h={"60"} mr={4} bgColor={colors.dark[700]}>
          <MaterialCommunityIcons name="file-image" size={24} />
        </Center>
        <VStack flex={1}>
          <HStack alignItems="flex-start">
            <VStack flex={1}>
              <Text fontSize={16} fontWeight="bold" textTransform="capitalize">
                {item.name}
              </Text>
              <Text fontSize={12} fontWeight="light" textTransform="capitalize">
                {item?.category?.category}
              </Text>
            </VStack>
            <IconButton
              size="xs"
              onPress={removeFromCart}
              icon={<Icon as={MaterialCommunityIcons} name="close" size={4} />}
            />
          </HStack>
          <HStack>
            <HStack alignItems="center" flex={1}>
              <Text fontSize={16} fontWeight="bold">
                MK{(+item.price).toFixed(2)}
              </Text>
              <Text fontSize={12}>/{item?.measurement?.measurement}</Text>
            </HStack>
            <HStack
              alignItems="center"
              borderColor="dark.700"
              borderWidth={1}
              borderRadius="4"
            >
              <IconButton
                size="xs"
                variant="ghost"
                onPress={subtractFromCart}
                icon={<Icon as={MaterialCommunityIcons} name="minus" />}
              />
              <Text width={10} textAlign="center">
                {item.quantity}
              </Text>
              <IconButton
                size="xs"
                variant="ghost"
                onPress={addToCart}
                icon={<Icon as={MaterialCommunityIcons} name="plus" />}
              />
            </HStack>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default Cart;
