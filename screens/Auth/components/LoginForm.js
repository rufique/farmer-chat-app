import * as React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  FormControl,
  Input,
  Stack,
  Icon,
  Text,
  Heading,
  Button,
} from "native-base";
import { Entypo } from "@native-base/icons";

const LoginSchema = Yup.object().shape({
  mobile: Yup.number().required(),
  pin: Yup.number().required(),
});

const LoginForm = ({ handleOnSubmit }) => {
  return (
    <Formik
      initialValues={{
        mobile: "",
        pin: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={(values, actions) => {
        handleOnSubmit(values, actions);
      }}
    >
      {({
        values,
        errors,
        handleChange,
        touched,
        isSubmitting,
        handleSubmit,
      }) => (
        <Box marginY={32} paddingX={8}>
          <Stack mb={4} mt={8}>
            <Heading size="md" marginBottom={2}>
              Login
            </Heading>
            <Text>Enter mobile number and pin to login</Text>
            {errors.authError && <Text color="red.500">{errors.authError}</Text>}
          </Stack>
          <FormControl
            isInvalid={errors.mobile && touched.mobile}
            isRequired
          >
            <Stack>
              <FormControl.Label>Mobile</FormControl.Label>
              <Input
                keyboardType="phone-pad"
                variant="underlined"
                type="mobile"
                defaultValue={values.mobile}
                placeholder="mobile"
                onChangeText={handleChange('mobile')}
              />
              <FormControl.ErrorMessage
                leftIcon={<Icon as={Entypo} name="warning" size="xs" />}
              >
                {errors.mobile}
              </FormControl.ErrorMessage>
            </Stack>
          </FormControl>
          <FormControl
            isInvalid={errors.pin && touched.pin}
            isRequired
            marginY={8}
          >
            <Stack>
              <FormControl.Label>Pin</FormControl.Label>
              <Input
                variant="underlined"
                type="pin"
                defaultValue={values.pin}
                placeholder="pin"
                onChangeText={handleChange('pin')}
              />
              <FormControl.ErrorMessage
                leftIcon={<Icon as={Entypo} name="warning" size="xs" />}
              >
                {errors.pin}
              </FormControl.ErrorMessage>
            </Stack>
          </FormControl>
          <Button
            onPress={handleSubmit}
            isLoading={isSubmitting}
            isLoadingText="Signing in..."
            disabled={isSubmitting}
          >
            Sign in
          </Button>
        </Box>
      )}
    </Formik>
  );
};

export default LoginForm;
