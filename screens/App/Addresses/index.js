import {
  Actionsheet,
  Box,
  Center,
  FlatList,
  HStack,
  Icon,
  Pressable,
  Text,
  useTheme,
  VStack,
} from "native-base";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserAddressesQuery } from "../../../services/addressService/address.service";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { updateAddress } from "../../../featured/addresses";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

const Addresses = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { user } = useSelector((state) => state.authReducer);
  const { address } = useSelector((state) => state.addressesReducer);
  const [ showAddressActions, setShowAddressActions ] = React.useState(false)
  const {
    data: addresses,
    isLoading,
    error,
  } = useGetUserAddressesQuery(user?.sub);

  useEffect(()=>{
    dispatch(updateAddress(null));
    setShowAddressActions(false);
  },[])

  const onSelectAddress = (address) => {
    let coords = {};
    const coordsSplit = address.coords.split(",");
    coords = {
        latitude: +(coordsSplit[0].trim()),
        longitude: +(coordsSplit[1].trim()),
    }
    dispatch(updateAddress({...address, coords}));
    setShowAddressActions(true);
  };

  const handleOnClose = () => {
    dispatch(updateAddress(null));
    setShowAddressActions(false);
  };

  return (
    <Box backgroundColor={colors.white} flex={1}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <VStack>
          <FlatList
            data={addresses}
            renderItem={({ item }) => {
              let isSelectAddress = item.id === address?.id;
              return (
                <Box p={4} bgColor={isSelectAddress ? "dark.700" : "white"}>
                  <Pressable onPress={() => onSelectAddress(item)}>
                    <HStack>
                      <VStack flex={1} justifyContent="center">
                        <VStack>
                          <Text
                            color="dark.500"
                            textTransform="capitalize"
                            fontSize="12"
                          >
                            {item.addressType}
                          </Text>
                          <Text flex={1} fontWeight="bold">
                            {item.address}
                          </Text>
                        </VStack>
                        <HStack>
                          <Text textTransform="capitalize" fontWeight="bold">
                            {item.city}
                          </Text>
                        </HStack>
                      </VStack>
                      <Center>
                        <Icon
                          as={MaterialCommunityIcons}
                          name="chevron-right"
                          size={6}
                        />
                      </Center>
                    </HStack>
                  </Pressable>
                </Box>
              );
            }}
          />
          <Actionsheet isOpen={showAddressActions} onClose={handleOnClose}>
            <Actionsheet.Content>
              <Actionsheet.Item
                onPress={() => navigate("AddressMapView")}
                startIcon={<Icon as={MaterialIcons} name="map" />}
              >
                View on Map
              </Actionsheet.Item>
              <Actionsheet.Item
                onPress={() => navigate("AddAddress", { id: address?.id })}
                startIcon={<Icon as={MaterialIcons} name="edit-location" />}
              >
                Edit
              </Actionsheet.Item>
            </Actionsheet.Content>
          </Actionsheet>
        </VStack>
      )}
    </Box>
  );
};

export default Addresses;
