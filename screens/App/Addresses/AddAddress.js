import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  Pressable,
  Radio,
  Stack,
  Text,
  VStack,
} from "native-base";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  useCreateAddressMutation,
  useGetUserAddressesQuery,
} from "../../../services/addressService/address.service";
import { useState } from "react";
import { updateAddress } from "../../../featured/addresses";
import { Dimensions, ToastAndroid } from "react-native";
import useGeoLocation from "../../../hooks/useGeoLocation";
import MapView, { Marker } from "react-native-maps";
import { ADDRESS_TYPES } from "../../../constants";

const AddressSchema = Yup.object().shape({
  address: Yup.string().required(),
  city: Yup.string().required(),
  addressType: Yup.string().required(),
});

const { width, height } = Dimensions.get("window");

const AddAddress = () => {
  let [isMapModalVisible, setShowMapModal] = useState(false);
  let [isAddressTypeModalVisible, setShowAddressTypeModal] = useState(false);
  let { location, errorMsg, loadingMap, setLocation } = useGeoLocation();
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      address: "",
      city: "",
      coords: location?.coords,
      addressType: "",
    },
    validationSchema: AddressSchema,
    onSubmit: async (values, actions) => {
      try {
        values = {
          ...values,
          userId: user?.sub,
          coords: `${values.coords.latitude},${values.coords.longitude}`,
        };
        console.log(values);
        let result = await createAddress(values);
        console.log(result);
      } catch (err) {
        actions.setSubmitting(false);
        ToastAndroid.show(err.message, ToastAndroid.LONG);
      }
    },
  });
  const dispatch = useDispatch();
  let [skip, setSkipQuery] = useState(true);
  const { address } = useSelector((state) => state.addressesReducer);
  const { user } = useSelector((state) => state.authReducer);
  const { params } = useRoute();
  const { data, isLoading, error } = useGetUserAddressesQuery(params?.id, {
    skip,
  });

  const [createAddress] = useCreateAddressMutation();

  useEffect(() => {
    if (params?.id) {
      // then check if we are fetching address from server...
      if (!address) {
        setSkipQuery(false);
      } else {
        setAddress(address);
        setLocation(address?.coords);
      }
    }
  }, [params, address]);

  useEffect(() => {
    // this runs only when we're updating address from the server
    if (!isLoading && !address) {
      dispatch(updateAddress(data));
    }
  }, [address, data]);

  const setAddress = (addressObject) => {
    let { address, city, coords, addressType } = addressObject;
    setValues({ address, city, coords, addressType });
  };

  const handleOnRegionChange = (region) => {
    setLocation({ latitude: region.latitude, longitude: region.longitude });
  };

  const handleOnMarkerPositionChange = (event) => {
    let { coordinate } = event;
    setLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  const onSetLocation = () => {
    setShowMapModal(false);
    setFieldValue("coords", location.coords);
  };

  const onCancelLocation = () => {
    setShowMapModal(false);
    setShowAddressTypeModal(false);
  };

  return (
    <Box backgroundColor="white" flex={1}>
      <VStack p={4}>
        <Text>We'll use your address for our heat maps</Text>
      </VStack>
      <Box p={4}>
        <FormControl isInvalid={errors.address && touched.address} isRequired>
          <Stack>
            <FormControl.Label>Address Line</FormControl.Label>
            <Input
              variant="underlined"
              type="text"
              defaultValue={values.address}
              placeholder="Enter your address"
              onChangeText={handleChange("address")}
            />
            <FormControl.ErrorMessage
              leftIcon={<Icon as={Entypo} name="warning" size="xs" />}
            >
              {errors.address}
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>
        <FormControl isInvalid={errors.city && touched.city} isRequired>
          <Stack>
            <FormControl.Label>City</FormControl.Label>
            <Input
              variant="underlined"
              type="text"
              defaultValue={values.city}
              placeholder="Enter your city"
              onChangeText={handleChange("city")}
            />
            <FormControl.ErrorMessage
              leftIcon={<Icon as={Entypo} name="warning" size="xs" />}
            >
              {errors.city}
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>
        <FormControl isDisabled required>
          <Pressable onPress={() => setShowMapModal(true)}>
            <FormControl.Label>Coordinates</FormControl.Label>
            <Input
              variant="underlined"
              type="text"
              defaultValue={
                loadingMap
                  ? ""
                  : !values.coords?.latitude || !values.coords?.longitude
                  ? "Pick coordinates"
                  : `${values.coords?.latitude}/${values.coords?.longitude}`
              }
              placeholder="Enter your coordinates"
            />
          </Pressable>
          <FormControl.HelperText>
            Your coordinates will allow us to locate you on google maps
          </FormControl.HelperText>
        </FormControl>
        <FormControl isDisabled required>
          <Pressable onPress={() => setShowAddressTypeModal(true)}>
            <FormControl.Label>Address Type</FormControl.Label>
            <Input
              variant="underlined"
              type="text"
              defaultValue={values.addressType}
              placeholder="Select address type"
            />
          </Pressable>
        </FormControl>
        <Button mt={2} onPress={handleSubmit}>
          Save Address
        </Button>
      </Box>
      <Modal isOpen={isMapModalVisible} onClose={onCancelLocation}>
        <Modal.Content h={height} borderRadius={0} maxH={height} w={width}>
          <Box position="relative">
            {!loadingMap && (
              <>
                <MapView
                  style={{ width, height }}
                  initialRegion={{
                    latitude: +location?.coords?.latitude,
                    longitude: +location?.coords?.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                    zoom: 32,
                  }}
                  //customMapStyle={MAP_STYLES}
                  onRegionChange={handleOnRegionChange}
                >
                  <Marker
                    draggable
                    onDragEnd={(event) =>
                      handleOnMarkerPositionChange(event.nativeEvent)
                    }
                    coordinate={{
                      longitude: +location?.coords?.longitude,
                      latitude: +location?.coords?.latitude,
                    }}
                    title={"My Position"}
                  />
                </MapView>
                <Box position="absolute" bottom={60} left={4} right={4}>
                  <VStack space={2} bgColor="white" p={4}>
                    <HStack justifyContent="space-between">
                      <Text>Latitude: {+location?.coords?.latitude}</Text>
                      <Text>Longitude: {+location?.coords?.longitude}</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                      <Button onPress={onCancelLocation} variant="secondary">
                        Cancel
                      </Button>
                      <Button onPress={onSetLocation} size="xs">
                        Set Coordinates
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </>
            )}
          </Box>
        </Modal.Content>
      </Modal>
      <Modal isOpen={isAddressTypeModalVisible} onClose={onCancelLocation}>
        <Modal.Content
          h={height}
          backgroundColor="white"
          borderRadius={0}
          maxH={height}
          minW={width}
        >
          <HStack p={4}>
            <IconButton
              onPress={onCancelLocation}
              icon={<Icon as={MaterialCommunityIcons} name="close" />}
            />
          </HStack>
          <Box p={4} flex={1} w={width}>
            <Radio.Group
              name="Address Type"
              value={values.addressType}
              onChange={(nextValue) => {
                setFieldValue("addressType", nextValue);
              }}
            >
              {ADDRESS_TYPES.map((addressType, index) => (
                <Radio key={index} value={addressType}>
                  <HStack py={4} pl={4} mb={1} minW={width - 100} maxW={width}>
                    <Text
                      textAlign="right"
                      textTransform="capitalize"
                      fontWeight="bold"
                    >
                      {addressType}
                    </Text>
                  </HStack>
                </Radio>
              ))}
            </Radio.Group>
          </Box>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default AddAddress;
