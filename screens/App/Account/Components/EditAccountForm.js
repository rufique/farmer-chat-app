import { useFormik } from "formik";
import { Box, Button, FormControl, Input, Text, VStack } from "native-base";

const EditAccountForm = ({ userInfo }) => {
  const { values, error, touched, handleChange, handleSubmit } = useFormik({
    initialValues: { ...userInfo },
  });

  return (
    <Box p={4}>
      <VStack space={2}>
        <FormControl required>
          <FormControl.Label>Username/ Mobile number</FormControl.Label>
          <Input variant="underlined" value={values.username} />
        </FormControl>
        <FormControl required>
          <FormControl.Label>First name</FormControl.Label>
          <Input variant="underlined" value={values.firstname} />
        </FormControl>
        <FormControl required>
          <FormControl.Label>Last name</FormControl.Label>
          <Input variant="underlined" value={values.lastname} />
        </FormControl>
        <FormControl required>
          <FormControl.Label>National Id</FormControl.Label>
          <Input variant="underlined" value={values.nationalId} />
        </FormControl>
        <Button mt={4}>Save</Button>
      </VStack>
    </Box>
  );
};

export default EditAccountForm;
