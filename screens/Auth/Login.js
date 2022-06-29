import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLoginMutation } from "../../services/authService/auth.service";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../featured/auth/auth.slice";
import * as SecureStore from "expo-secure-store";
import { Box } from "native-base";
import LoginForm from "./components/LoginForm";

const Login = () => {
  const dispatch = useDispatch();
  const { reset } = useNavigation();
  const auth = useSelector(state => state.authReducer);
  let [ login ] = useLoginMutation();

  React.useEffect(()=>{
    if(auth.isLoggedIn) {
      reset({
        index: 0,
        routes: [
          {name: 'Home'}
        ],
      })
    }
  }, [auth])

  const handleOnSubmit = async(values, actions) => {
    try {
      actions.setFieldError('authError', null);
      let result = await login(values);
      if(result?.error) {
        throw result.error.data;
      }
      let { accessToken } = result.data;
      await SecureStore.setItemAsync("farmers_app_token", accessToken);
      actions.setSubmitting(false);
      dispatch(setCredentials({ accessToken }));
    } catch (error) {
      actions.setSubmitting(false);
      actions.setFieldError('authError', error.message);
    }
  };

  return (
    <Box bg="muted.100" safeArea height="100%">
      <LoginForm handleOnSubmit={handleOnSubmit}/>
    </Box>
  );
};

export default Login;
