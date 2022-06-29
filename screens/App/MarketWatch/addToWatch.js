import {
  Box,
  Button,
  FlatList,
  HStack,
  Pressable,
  Text,
  useTheme,
  VStack,
  Actionsheet,
  Input,
  InputGroup,
  InputLeftAddon,
  Icon,
  useToast,
} from "native-base";
import * as React from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useCreateMarketWatchMutation, useGetRetailerWatchQuery, useUpdateMarketWatchMutation } from "../../../services/marketWatchService/marketWatch.service";
import { StatusBar } from "expo-status-bar";
import { useGetProductsInWatchQuery } from "../../../services/productService/product.service";
import { useSelector } from "react-redux";
import * as _ from "lodash";
import { useGetUserAddressesQuery } from "../../../services/addressService/address.service";

const AddToWatch = () => {
  const { colors } = useTheme();
  const toast = useToast();
  const { user } = useSelector((state) => state.authReducer);
  const inputRef = React.useRef();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isListChanged, setIsListChanged] = React.useState(false);
  const [selectedProduct, updateSelectedProduct] = React.useState({});
  let [retailerList, updateRetailerList] = React.useState([]);

  let { data: watchList, isLoading } = useGetProductsInWatchQuery({
    refreshOnMount: true,
  });

  let { data: retailerWatchList, isLoading: loadingRetailers } =
    useGetRetailerWatchQuery(user.sub, {
      refreshOnMount: true,
    });

    const {
      data: addresses,
      isLoading: loadingAddress,
      error,
    } = useGetUserAddressesQuery(user?.sub + "?address_type=stall", {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });

  const [ createMarketWatch, { isLoading: isCreating } ] = useCreateMarketWatchMutation();
  const [ updateMarketWatch, { isLoading: isUpdating } ] = useUpdateMarketWatchMutation();

  React.useEffect(() => {
    let isListChanged = _.isEqual(
      _.sortBy(retailerWatchList, "productId"),
      _.sortBy(retailerList, "productId")
    );
    setIsListChanged(isListChanged);
  }, [retailerList]);

  React.useEffect(() => {
    if (!loadingRetailers) {
      updateRetailerList(retailerWatchList);
    }
  }, [retailerWatchList, loadingRetailers]);

  const inWatchList = (productId) => {
    return (
      retailerList.length &&
      retailerList.find((product) => product.productId === productId)
    );
  };

  const onSelectedProduct = (productId) => {
    const selectedProduct = watchList.find(
      (product) => product.id === productId
    );
    const inList = inWatchList(selectedProduct.id);
    updateSelectedProduct({
      ...selectedProduct,
      sellingPrice: !!inList ? inList.sellingPrice : 0,
    });
    setIsOpen(true);
  };

  const onCancel = () => {
    updateSelectedProduct({});
    setIsOpen(false);
  };

  const handleAddToList = () => {
    let { name, sellingPrice, id: productId } = selectedProduct;
    let inList = inWatchList(productId);
    let newRetailerList = [];
    if (!!inList) {
      newRetailerList = retailerList.map((product) =>
        product.productId === productId
          ? { ...product, sellingPrice: +sellingPrice }
          : product
      );
    } else {
      newRetailerList = [
        ...retailerList,
        { name, sellingPrice: +sellingPrice, productId },
      ];
    }
    updateRetailerList(newRetailerList);
    onCancel();
  };

  const onChangeSellingPrice = (val) => {
    let product = { ...selectedProduct, sellingPrice: val };
    updateSelectedProduct(product);
  };

  const handleRemoveFromList = () => {
    let newList = retailerList.filter(
      (product) => product.productId !== selectedProduct.id
    );
    updateRetailerList(newList);
    onCancel();
  };

  const saveMarketWatch = async () => {
    if (watchList.length !== retailerList.length) {
      toast.show({
        title: "All products are required.",
      });
    } else {
      try {
        let values = {
          locationId: addresses[0]?.id,
          retailerId: user?.sub,
          products: retailerList.map(product => ({id: product.productId, sellingPrice: product.sellingPrice})),
        }
        let result;
        if (retailerWatchList.length) {
          // update,
          result = await updateMarketWatch({id: retailerList[0].watchId, ...values}).unwrap();
        } else {
          // create
          result = await createMarketWatch(values).unwrap();
          toast.show({
            title: 'Market watch updated successfully'
          })
        }
        console.log(result);
      } catch (error) {
        toast.show({title: error.message})
      }
    }
  };

  return (
    <>
      <StatusBar backgroundColor="white" style={"dark"} />
      {isLoading ? (
        <Box
          backgroundColor={colors.white}
          flex={1}
          justifyContent="center"
          alignItems="center"
        >
          <Text>Fetching Data...</Text>
        </Box>
      ) : (
        <Box backgroundColor={colors.white} flex={1}>
          <VStack
            space={2}
            paddingX={4}
            paddingY={3}
            alignItems="center"
            borderBottomWidth={0.5}
            borderColor="dark.600"
          >
            <Text color={colors.dark[500]} fontWeight="bold">
              Select a product and enter your selling price, when completed,
              click save to submit
            </Text>
            <Text color="red.500" mt={2}>
              You are required to submit prices for all products listed before
              you can place orders.
            </Text>
          </VStack>
          <FlatList
            data={watchList}
            renderItem={({ item }) => {
              let inList = inWatchList(item.id);
              return (
                <Pressable onPress={() => onSelectedProduct(item.id)}>
                  <Box
                    backgroundColor={
                      !!inList ? colors.primary[100] : "transparent"
                    }
                  >
                    <HStack
                      space={2}
                      alignItems="center"
                      justifyContent="space-between"
                      paddingX={4}
                      paddingY={2}
                    >
                      <VStack>
                        <Text textTransform="capitalize" fontWeight="bold">
                          {item.name}
                        </Text>
                        <Text color={colors.dark[400]}>
                          MK{(+item?.recommendedSellingPrice).toFixed(2)}/bag
                        </Text>
                      </VStack>
                      <VStack>
                        <Text fontWeight="bold">My Price</Text>
                        <Text fontWeight="bold">
                          /
                          {!!inList ? inList?.sellingPrice.toFixed(2) : "unset"}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </Pressable>
              );
            }}
          />
          <Box p={4}>
            <Button
              //disabled={isListChanged}
              onPress={saveMarketWatch}
              startIcon={<Icon as={MaterialIcons} name="save" />}
              isLoading={isCreating || isUpdating}
            >
              Save
            </Button>
          </Box>

          <Actionsheet isOpen={isOpen} onClose={onCancel}>
            <Actionsheet.Content>
              <Box minHeight={100} width={"100%"} paddingX={4}>
                <VStack space={4}>
                  <Text fontSize="16" color="dark.200">
                    {selectedProduct?.name}
                  </Text>
                  <Input
                    autoFocus
                    keyboardType="numeric"
                    ref={inputRef}
                    onLayout={() => inputRef.current.focus()}
                    InputLeftElement={
                      <Text fontSize="12" color="dark.500">
                        MK
                      </Text>
                    }
                    onChangeText={onChangeSellingPrice}
                    variant="underlined"
                    textAlign="right"
                    placeholder="Enter Price"
                    defaultValue={"" + selectedProduct?.sellingPrice}
                    //value={12.00}
                  />
                  <HStack
                    space={4}
                    justifyContent="space-between"
                    marginTop="8"
                    marginBottom="4"
                  >
                    <Button variant="ghost" onPress={onCancel}>
                      Cancel
                    </Button>
                    <HStack space={4}>
                      <Button variant="ghost" onPress={handleRemoveFromList}>
                        Remove
                      </Button>
                      <Button onPress={handleAddToList}>Add</Button>
                    </HStack>
                  </HStack>
                </VStack>
              </Box>
            </Actionsheet.Content>
          </Actionsheet>
        </Box>
      )}
    </>
  );
};

const ItemPrice = ({ range, price }) => {
  const { colors } = useTheme();

  return (
    <HStack>
      <Text color={colors.dark[500]}>{range}</Text>
      <Text fontWeight="bold">{price.toFixed(2)}</Text>
    </HStack>
  );
};

export default AddToWatch;
