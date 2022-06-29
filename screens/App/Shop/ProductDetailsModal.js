import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Input,
  Stack,
  Text,
  useTheme,
  VStack,
} from "native-base";
import * as React from "react";
import { Dimensions } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useGetProductQuery } from "../../../services/productService/product.service";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../../../featured/cart/cart.slice";

const { width, height } = Dimensions.get("window");

const ProductDetailsModal = () => {
  let { params } = useRoute();
  let { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cartReducer);
  const { colors } = useTheme();
  let [activeSlide, setActiveSlide] = React.useState(0);
  let { data: product, isLoading: loadingProduct } = useGetProductQuery(
    params?.id,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const images = [
    { title: "image1", text: "image1" },
    { title: "image2", text: "image2" },
    { title: "image3", text: "image3" },
  ];

  const addToCart = () => {
    let newCart = [];
    if (!!inCart()) {
      newCart = cart.map((cartProduct) =>
        cartProduct.id === product.id
          ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
          : cartProduct
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    dispatch(updateCart(newCart));
  };

  const removeFromCart = () => {
    let cartItem = inCart();
    let newCart = [];
    if (!!cartItem) {
      if (cartItem?.quantity === 1) {
        newCart = cart.filter((cartProduct) => cartProduct.id !== cartItem?.id);
      } else {
        newCart = cart.map((cartProduct) =>
          cartProduct.id === product.id
            ? { ...cartProduct, quantity: cartProduct.quantity - 1 }
            : cartProduct
        );
      }
      dispatch(updateCart(newCart)); 
    }
  };

  const inCart = () => {
    return cart.find((item) => item.id === product.id);
  };

  const viewCart = () => navigate('Cart');

  return (
    <Box backgroundColor={colors.white} flex={1} safeAreaY position="relative">
      {loadingProduct ? (
        <Box>
          <Text>Loading, Wait...</Text>
        </Box>
      ) : (
        <Box>
          <HStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            px={2}
            py={2}
            zIndex={5}
          >
            <IconButton
              onPress={() => goBack()}
              icon={
                <Icon
                  size="lg"
                  color="dark.300"
                  as={MaterialIcons}
                  name="arrow-back"
                />
              }
            />
          </HStack>
          <Carousel
            data={images}
            layout="default"
            sliderWidth={width}
            itemWidth={width}
            enableSnap
            pagingEnabled={true}
            onSnapToItem={(index) => setActiveSlide(index)}
            renderItem={({ item }) => {
              return (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor={colors.dark[800]}
                  height={height / 2.315}
                >
                  <Text>{item.title}</Text>
                </Stack>
              );
            }}
          />
          <Pagination
            dotsLength={images.length}
            activeDotIndex={activeSlide}
            containerStyle={{ paddingVertical: 4 }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: colors.primary[500],
            }}
            activeDotStyle={{}}
            inactiveDotOpacity={0.4}
          />
          <VStack mt={4} padding={4}>
            <HStack mb={4}>
              <VStack flex={1}>
                <Text
                  fontSize={18}
                  textTransform="capitalize"
                  fontWeight="bold"
                >
                  {product.name}
                </Text>
                <Text
                  fontSize={12}
                  textTransform="capitalize"
                  fontWeight="light"
                  color="dark.500"
                >
                  {product?.category?.category}
                </Text>
              </VStack>
            </HStack>
            <Text>{product.description}</Text>
            <HStack mt={8} justifyContent="space-between" alignItems="center">
              <HStack alignItems="center">
                <Text fontSize={24} fontWeight="bold">
                  MK{product?.price}
                </Text>
                <Text fontSize={14} fontWeight="bold">
                  /{product?.measurement?.measurement}
                </Text>
              </HStack>
              <HStack space={2}>
                <HStack
                  alignItems="center"
                  borderColor="dark.700"
                  borderWidth={1}
                  borderRadius="4"
                >
                  <Button
                    size="xs"
                    variant="ghost"
                    onPress={removeFromCart}
                    leftIcon={<MaterialCommunityIcons name="minus" />}
                  />
                  <Text width={10} textAlign="center">
                    {!!inCart() ? "" + inCart()?.quantity : "0"}
                  </Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    onPress={addToCart}
                    leftIcon={<MaterialCommunityIcons name="plus" />}
                  />
                </HStack>
                <Button onPress={viewCart}>View Cart</Button>
              </HStack>
            </HStack>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetailsModal;
