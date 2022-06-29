import {
  Box,
  Button,
  Center,
  Container,
  FlatList,
  HStack,
  Icon,
  IconButton,
  Text,
  useTheme,
  VStack,
} from "native-base";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { updateCart } from "../../../featured/cart/cart.slice";
import { useNavigation } from "@react-navigation/native";

const Cart = () => {
  const { cart } = useSelector((state) => state.cartReducer);
  const dispatch = useDispatch();
  const { navigate } = useNavigation()
  const { colors } = useTheme();
  const [cartTotal, updateCartTotal] = React.useState(0);

  React.useEffect(() => {
    let cartTotal = cart.reduce(
      (acc, cur) => (acc += +cur.price * +cur.quantity),
      0
    );
    updateCartTotal(cartTotal);
  }, [cart]);

  const addToCart = (product) => {
    let newCart = cart.map((cartProduct) =>
        cartProduct.id === product.id
          ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
          : cartProduct
      );
    dispatch(updateCart(newCart));
  };

  const subtractFromCart = (product) => {
    let newCart = [];
    if (product?.quantity === 1) {
      newCart = cart.filter((cartProduct) => cartProduct.id !== product?.id);
    } else {
      newCart = cart.map((cartProduct) =>
        cartProduct.id === product.id
          ? { ...cartProduct, quantity: cartProduct.quantity - 1 }
          : cartProduct
      );
    }
    dispatch(updateCart(newCart));
  };

  const removeFromCart = (id) => {
    let newCart = cart.filter((cartProduct) => cartProduct.id !== id);
    dispatch(updateCart(newCart));
  };

  return (
    <Box backgroundColor={colors.white} flex={1}>
      <Box flex={1.5}>
        <FlatList
          data={cart}
          // keyExtractor={item.id}
          renderItem={({ item }) => {
            return (
              <CartItem
                item={item}
                addToCart={() => addToCart(item)}
                removeFromCart={() => removeFromCart(item.id)}
                subtractFromCart={() => subtractFromCart(item)}
              />
            );
          }}
        />
      </Box>
      <Box p={4} flex={1}>
        <Box flex={1} borderRadius="4">
          <HStack
            py={4}
            px={2}
            borderBottomWidth={1}
            borderColor={colors.light[300]}
            justifyContent="space-between"
          >
            <Text>Subtotal</Text>
            <Text fontWeight="bold">MK{+cartTotal.toFixed(2)}</Text>
          </HStack>
          <HStack
            py={4}
            px={2}
            borderBottomWidth={1}
            borderColor={colors.light[300]}
            justifyContent="space-between"
          >
            <Text>Shipping</Text>
            <Text fontWeight="bold">MK{(0.0).toFixed(2)}</Text>
          </HStack>
          <HStack py={4} px={2} justifyContent="space-between">
            <Text>Cart Total</Text>
            <Text fontWeight="bold">MK{+cartTotal.toFixed(2)}</Text>
          </HStack>
          <HStack px={4} mt={4} w="100%">
            <Button onPress={() => navigate('Checkout')} flex={1}>Proceed to Checkout</Button>
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
