import * as React from "react";
import {
  Box,
  Button,
  HStack,
  Input,
  Pressable,
  FlatList,
  Stack,
  Text,
  useTheme,
  VStack,
  Actionsheet,
  Modal,
} from "native-base";
import { Dimensions } from "react-native";
import { useGetProductsQuery } from "../../../services/productService/product.service";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const Shop = () => {
  const { colors } = useTheme();
  const { cart } = useSelector((state) => state.cartReducer);
  const { navigate } = useNavigation();
  let { data: products, isLoading } = useGetProductsQuery({
    refetchOnFocus: true,
  });

  let [isOpen, setIsOpen] = React.useState(false);
  let [selectedProduct, updateSelectedProduct] = React.useState({});

  const onSelectedProduct = (id) => {
    let product = products.find((product) => product.id === id);
    updateSelectedProduct(product);
    setIsOpen(true);
  };

  const handleClose = () => {
    updateSelectedProduct({});
    setIsOpen(false);
  };

  const inCart = (product) => {
    return cart.some((cartProduct) => cartProduct.id === product.id);
  };

  return (
    <Box backgroundColor={colors.white} flex={1}>
      <HStack paddingX={4} paddingY={2} space={2}>
        <Input // this should be a button to the search page
          placeholder="Search products"
          InputLeftElement={
            <MaterialIcons name="search" size={24} color={colors.dark[500]} />
          }
          variant="unstyled"
          flex={1}
        />
        <Button
          variant="primary"
          leftIcon={<MaterialCommunityIcons name="filter-variant" size={12} />}
        >
          Filter
        </Button>
      </HStack>
      {isLoading ? (
        <Box>
          <Text>Loading, Please wait...</Text>
        </Box>
      ) : (
        <>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 60,
            }}
            data={products}
            numColumns={2}
            renderItem={({ item: product, index }) => (
              <ProductComponent
                isInCart={inCart}
                product={product}
                index={index}
                onPress={() => navigate("ProductDetails", { id: product.id })}
              />
            )}
          />
        </>
      )}
    </Box>
  );
};

const ProductComponent = ({ isInCart, product, onPress, index }) => {
  let inCart = isInCart(product);
  const { colors } = useTheme();

  return (
    <Box
      position="relative"
      marginBottom={4}
      mr={index % 2 === 0 ? 4 : 0}
      backgroundColor={inCart ? colors.dark[700] : colors.dark[900]}
      borderRadius="4"
      borderWidth={inCart ? 2 : 0}
      borderColor={colors.primary[100]}
      width={width / 2 - 24}
    >
      {inCart && (
        <Box
          position="absolute"
          top={-8}
          left={-8}
          zIndex={16}
          alignItems="center"
          justifyContent="center"
          height={4}
          width={4}
          borderRadius="50"
          borderWidth={1}
          borderColor={colors.primary[200]}
        >
            <MaterialCommunityIcons size={14} name="check-circle" color={colors.primary[500]}/>
        </Box>
      )}
      <Pressable onPress={onPress}>
        <VStack
          borderWidth={0.5}
          borderColor={colors.dark[900]}
          alignItems="flex-start"
          justifyContent="center"
        >
          <Stack
            justifyContent="center"
            alignItems="center"
            width="100%"
            height={width / 2}
          >
            <MaterialCommunityIcons
              size={24}
              color={colors.dark[700]}
              name="image-broken"
            />
          </Stack>
          <HStack
            padding={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <VStack flex={1}>
              <Text textTransform="capitalize" fontWeight="bold">
                {product.name}
              </Text>
              <Text>MK{(+product.price).toFixed(2)}</Text>
            </VStack>
            <MaterialCommunityIcons name="chevron-right" size={16} />
          </HStack>
        </VStack>
      </Pressable>
    </Box>
  );
};

export default Shop;
