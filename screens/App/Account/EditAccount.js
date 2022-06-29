import { useNavigation } from "@react-navigation/native";
import {
  Avatar,
  Box,
  Center,
  Pressable,
  Stack,
  Text,
  VStack,
} from "native-base";
import { useSelector } from "react-redux";
import {
  useGetUserProfileQuery,
  useUploadUserPhotoMutation,
} from "../../../services/authService/auth.service";
import EditAccountForm from "./Components/EditAccountForm";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ToastAndroid } from "react-native";

const EditAccount = () => {
  const { user } = useSelector((state) => state.authReducer);
  const { navigate } = useNavigation();
  const {
    data: userInfo,
    isloading,
    error,
  } = useGetUserProfileQuery(user?.sub);
  const [image, setImage] = useState(null);

  const [uploadUserPhoto, { isLoading: isUploading }] =
    useUploadUserPhotoMutation();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      await uploadImageAsync(result.uri);
    }
  };

  const uploadImageAsync = async (uri) => {
    try {
      let uriParts = uri.split(".");
      let fileType = uriParts[uriParts.length - 1];
      let file = {
        uri,
        name: `${user.username}_photo.${fileType}`,
        type: `image/${fileType}`,
      };
      console.log(file);
      let formData = new FormData();
      formData.append("file", file);
      let result = await uploadUserPhoto({
        id: user?.sub,
        photo: formData,
      });
      setImage(uri);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  return (
    <Box flex={1} bgColor="white">
      <Center>
        <Pressable onPress={pickImage}>
          <Avatar source={{ uri: image }} size={32} />
        </Pressable>
        <Text mt={4}>Change Profile Image</Text>
      </Center>
      <VStack p={4}>
        <StackItem
          label="Mobile number"
          onPress={() => navigate("ChangeMobileNumber", { id: user?.sub })}
          text={userInfo.username}
        />
        <StackItem
          label="Fullname"
          text={`${userInfo.firstname} ${userInfo.lastname}`}
        />
        <StackItem label="National Id" text={userInfo.nationalId} />
      </VStack>
      {/* <EditAccountForm userInfo={userInfo} /> */}
    </Box>
  );
};

const StackItem = ({ label, text, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <VStack mt={2}>
        <Text color="dark.500" textTransform="capitalize">
          {label}
        </Text>
        <Stack py={3} borderBottomWidth={0.5} borderBottomColor="dark.600">
          <Text>{text}</Text>
        </Stack>
      </VStack>
    </Pressable>
  );
};

export default EditAccount;
