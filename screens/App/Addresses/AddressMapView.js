import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Icon, IconButton } from "native-base";
import * as React from "react";
import { Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { updateAddress } from "../../../featured/addresses";

const { width, height } = Dimensions.get("window");

const AddressMapView = () => {
  const { goBack } = useNavigation();
  const dispatch = useDispatch();
  const { address } = useSelector((state) => state.addressesReducer);

  const onGoBack = () => {
    dispatch(updateAddress(null));
    goBack();
  };
  return (
    "coords" in address && (
      <Box safeAreaY position="relative">
        <MapView
          style={{ width, height }}
          initialRegion={{
            latitude: address?.coords.latitude,
            longitude: address?.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          zoomEnabled
          maxZoomLevel={16}
          minZoomLevel={10}
        >
          <Marker
            coordinate={{
              latitude: address?.coords.latitude,
              longitude: address?.coords.longitude,
            }}
            title={address.addressType}
            description={`${address.address}\n${address.city}`}
          />
        </MapView>
        <HStack px={4} py={2} position="absolute" bottom={0} justifyContent="flex-end" w={width}>
          <IconButton
            size="xs"
            bgColor="primary.500"
            icon={
              <Icon as={MaterialIcons} name="arrow-back" color="white" size="8" />
            }
            onPress={onGoBack}
          />
        </HStack>
      </Box>
    )
  );
};

export default AddressMapView;
