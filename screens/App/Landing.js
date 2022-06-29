import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  useTheme,
  VStack,
} from "native-base";
import * as React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BgImage from "../../assets/landing-bg.jpg";
import { StatusBar } from "expo-status-bar";
import { useDispatch } from "react-redux";
import { setIsIntro } from "../../featured/intro";

const Landing = () => {
  const theme = useTheme();

  const dispatch = useDispatch();

  const handleOnGetStarted = () => {
    dispatch(setIsIntro(false));
  };

  return (
    <Box
      position="relative"
      flex={1}
      justifyContent="flex-end"
      alignItems="center"
      safeArea
    >
      <StatusBar style="light" />
      <Box marginBottom={16}>
        <VStack space={8}>
          <VStack>
            <Text fontFamily="heading" fontSize={36} color="#fff">
              FAIR FOOD
            </Text>
            <Text fontFamily="heading" textAlign="center" color="#fff">
              Analyse, Order{"\n"}Prepare and Supply
            </Text>
          </VStack>
          <Button onPress={handleOnGetStarted}>Get started</Button>
        </VStack>
      </Box>

      <LinearGradient
        colors={["#15D89122", "#0BB54444", "#03221786", "#000"]}
        style={styles.gradientBg}
      />
      <Image
        source={BgImage}
        style={styles.bgImage}
        alt="vegetables background"
      />
      <View
        style={{
          ...styles.bottomBar,
          backgroundColor: theme.colors.primary[500],
        }}
      ></View>
    </Box>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    position: "absolute",
    zIndex: -1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgImage: {
    position: "absolute",
    top: 0,
    zIndex: -3,
    resizeMode: "contain",
    aspectRatio: 0.6,
  },
  bottomBar: {
    position: "absolute",
    width: 62,
    height: 5,
    bottom: 0,
    zIndex: 30,
  },
});

export default Landing;
