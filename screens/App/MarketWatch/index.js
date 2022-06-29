import {
  Box,
  Button,
  FlatList,
  HStack,
  Text,
  useTheme,
  VStack,
} from "native-base";
import * as React from "react";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGetWeeklyWatchListQuery } from "../../../services/marketWatchService/marketWatch.service";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

const MarketWatch = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { data: marketWatch, isLoading } = useGetWeeklyWatchListQuery({
    refreshOnMount: true,
  });

  return (
    <>
      <StatusBar backgroundColor="white" style={"dark"} />
      <Box backgroundColor={colors.white} flex={1}>
        <HStack space={2} paddingX={4} paddingY={3} alignItems="center">
          <Box
            backgroundColor="white"
            paddingX={2}
            paddingY={1}
            borderRadius={12}
          >
            <Text color={colors.dark[500]} fontWeight="bold">
              Week {moment().week()}
            </Text>
          </Box>
          <HStack
            flex={1}
            alignItems="center"
            justifyContent="flex-end"
            space={3}
          >
            <Button
              leftIcon={<MaterialCommunityIcons color={colors.dark[500]} name="plus" size={12} />}
              size="sm"
              variant="ghost"
              onPress={() =>navigate('addToWatch')}
            >
              Add
            </Button>
            <Button
              leftIcon={
                <MaterialCommunityIcons color={colors.dark[500]} name="filter-variant" size={12} />
              }
              size="sm"
              variant="ghost"
            >
              Filter
            </Button>
          </HStack>
        </HStack>
        <FlatList
          data={marketWatch}
          renderItem={({ item }) => {
            return (
              <Box
                paddingX={4}
                backgroundColor={colors.white}
                borderBottomWidth={0.5}
                borderBottomColor="dark.800"
              >
                <HStack paddingY={2}>
                  <VStack flex={1} space={1} justifyContent="space-between">
                    <Text textTransform="capitalize" fontWeight="bold">
                      {item.name}
                    </Text>
                    <Text fontSize={12} color={colors.dark[500]}>
                      #{item.submissions} Submissions
                    </Text>
                  </VStack>
                  <VStack
                    space={1}
                    alignItems="flex-end"
                    justifyContent="flex-end"
                    flex={1}
                  >
                    <HStack space={2} width="100%" justifyContent="space-between">
                      <ItemPrice range="lo" price={item.low} />
                      <ItemPrice range="Mid" price={item.mid} />
                      <ItemPrice range="Hi" price={item.high} />
                    </HStack>
                    <Text fontWeight="bold" color={colors.dark[400]}>
                      MK{item.recommendedSellingPrice}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            );
          }}
        />
      </Box>
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

export default MarketWatch;
