import { useRoute } from "@react-navigation/native";
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Icon,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import {
  useCancelOrderMutation,
  useGetOrderDetailsQuery,
} from "../../../services/orderService/order.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Timeline } from "react-native-just-timeline";
import { ToastAndroid } from "react-native";

const OrderDetails = () => {
  const { params } = useRoute();
  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(params?.id, {
    refetchOnMountOrArgChange: true,
  });
  const [cancelOrder, { isLoading: isUpdating, error: updateError }] =
    useCancelOrderMutation();
  const [trackingData, updateTrackingData] = useState([]);

  useEffect(() => {
    if (!!order) {
      let trackingData = order?.orderTracking.map((tracking) => ({
        title: () => (
          <VStack>
            <Text color="dark">{moment(tracking.trackedAt).format("lll")}</Text>
            <Text fontWeight="bold" color="dark" textTransform="capitalize">
              {tracking.trackingStatus}
            </Text>
          </VStack>
        ),
        time: {
          content: moment().format("ll"),
          style: {
            paddingTop: 8,
          },
        },
        icon: () => {
          if (tracking.trackingStatus === "warehouse") {
            return (
              <Icon as={MaterialCommunityIcons} name="warehouse" color="dark" />
            );
          }
          if (tracking.trackingStatus === "dispatched") {
            return (
              <Icon
                as={MaterialCommunityIcons}
                name="truck-delivery"
                color="dark"
              />
            );
          }
          if (tracking.trackingStatus === "delivered") {
            return (
              <Icon
                as={MaterialCommunityIcons}
                name="truck-check"
                color="dark"
              />
            );
          }
          return (
            <Icon as={MaterialCommunityIcons} name="circle" color="white" />
          );
        },
      }));
      updateTrackingData(trackingData);
    }
  }, [order, isLoading]);

  const onCancelOrder = async () => {
    try {
      let result = await cancelOrder({
        ...order,
        orderStatus: "cancelled",
      }).unwrap();
      console.log(result);
      ToastAndroid.show("Update was succesful", ToastAndroid.LONG);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  return (
    <Box flex={1} backgroundColor="white">
      {isLoading ? (
        <Center flex={1}>
          <Text>Loading order...</Text>
        </Center>
      ) : error ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : (
        <>
          <ScrollView style={{ flex: 1 }}>
            <VStack p={4} space={4} flex={1}>
              <HStack alignItems="flex-end">
                <VStack flex={1}>
                  <Text fontSize={16} fontWeight="bold">
                    Order Ref
                  </Text>
                  <Text fontWeight="bold">{order.orderRef}</Text>
                </VStack>
                <Text color="dark.500" fontSize="12">
                  {moment(order.createdAt).format("YY-MM-DD HH:mm a")}
                </Text>
              </HStack>
              <VStack space={2}>
                <Text fontSize={16} fontWeight="bold">
                  Shipping Address
                </Text>
                <VStack>
                  <Text>{order?.shippingAddress?.address}</Text>
                  <Text>
                    {order?.shippingAddress?.city} //{" "}
                    {order?.shippingAddress?.addressType}
                  </Text>
                </VStack>
              </VStack>
              <VStack
                space={2}
                bgColor="secondary"
                borderRadius="4"
                p={2}
                minH="100"
              >
                <Text fontSize={16} fontWeight="bold">
                  Order Tracking
                </Text>
                {trackingData.length > 0 && (
                  <Timeline
                    timeContainerStyle={{ display: "none" }}
                    contentContainerStyle={{
                      // flex: 1,
                      paddingVertical: 0,
                      paddingHorizontal: 8,
                      backgroundColor: "transparent",
                    }}
                    lineStyle={{ backgroundColor: "black" }}
                    data={trackingData}
                  />
                )}
              </VStack>
              <HStack
                space={2}
                bgColor="dark.800"
                justifyContent="space-between"
                borderRadius="4"
                alignItems="center"
                p={2}
              >
                <Text fontSize={16} flex={1} fontWeight="bold">
                  Order Status
                </Text>
                <Center
                  bgColor="primary.500"
                  px={2}
                  padding={1}
                  borderRadius="4"
                >
                  <Text textTransform="capitalize" color="white">
                    {order?.orderStatus}
                  </Text>
                </Center>
              </HStack>
              <VStack
                space={2}
                bgColor="dark.800"
                borderRadius="4"
                minH="100"
                p={2}
              >
                <Text fontSize={16} fontWeight="bold">
                  Order Summary
                </Text>
                <FlatList
                  data={order?.orderDetail}
                  keyExtractor={(item) => item?.product?.id}
                  renderItem={({ item, index }) => {
                    let isLast = index === order?.orderDetail.length - 1;
                    return (
                      <Box
                        py={2}
                        borderBottomWidth={!isLast ? 0.5 : 0}
                        borderColor="dark.500"
                      >
                        <HStack justifyContent="space-between">
                          <Text w="50%" textTransform="capitalize">
                            {item?.product?.name}
                          </Text>
                          <HStack flex={1} justifyContent="space-between">
                            <Text>{(+item.quantity).toFixed(0)}</Text>
                            <Text>MK{(+item.price).toFixed(2)}</Text>
                            <Text textAlign="right">
                              MK{(+item.price * +item.quantity).toFixed(2)}
                            </Text>
                          </HStack>
                        </HStack>
                      </Box>
                    );
                  }}
                />
                <HStack justifyContent="space-between">
                  <Text
                    flex={1}
                    w="50%"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    Total
                  </Text>
                  <Text
                    w="50%"
                    textAlign="right"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    MK{(+order?.orderTotal).toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </ScrollView>
          <HStack p={4} justifyContent="space-between">
            <Button
              variant="ghost"
              onPress={onCancelOrder}
              colorScheme="error"
              startIcon={
                <Icon as={MaterialIcons} name="cancel" color="red.500" />
              }
              disabled={order.orderStatus === "cancelled"}
            >
              Cancel Order
            </Button>
            <Button
              variant="ghost"
              colorScheme="primary"
              startIcon={
                <Icon as={MaterialIcons} name="print" color="primary.500" />
              }
            >
              Print
            </Button>
          </HStack>
        </>
      )}
    </Box>
  );
};

export default OrderDetails;
