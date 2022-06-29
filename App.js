import * as React from "react";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ToastAndroid } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./services";
import {
  restoreAuthentication,
  unsetCredentials,
} from "./featured/auth/auth.slice";
import * as SecureStore from "expo-secure-store";
import { startConnecting } from "./featured/chat/chat.slice";
import {
  Box,
  Text,
  NativeBaseProvider,
  extendTheme,
  useTheme,
  VStack,
  Button,
  IconButton,
  Icon,
} from "native-base";
import Landing from "./screens/App/Landing";
import * as Font from "expo-font";
import { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

// lazy load screens
const ChatScreen = React.lazy(() => import("./screens/Chat"));
const ChatUsersListScreen = React.lazy(() =>
  import("./screens/Chat/ChatUsersList")
);
const LoginScreen = React.lazy(() => import("./screens/Auth/Login"));
// marketwatch screens
const MarketWatchScreen = React.lazy(() => import("./screens/App/MarketWatch"));
const AddToWatchScreen = React.lazy(() =>
  import("./screens/App/MarketWatch/addToWatch")
);

// shop screens
const ShopScreen = React.lazy(() => import("./screens/App/Shop"));
const ProductDetailsModal = React.lazy(() =>
  import("./screens/App/Shop/ProductDetailsModal")
);
const CartScreen = React.lazy(() => import("./screens/App/Shop/Cart"));
const CheckoutScreen = React.lazy(() => import("./screens/App/Shop/Checkout"));
const OrderConfirmationScreen = React.lazy(() => import("./screens/App/Shop/OrderConfirmation"));
const OrderTrackerScreen = React.lazy(() => import("./screens/App/Shop/OrderTracker"));

// account screens
const AccountScreen = React.lazy(() => import("./screens/App/Account"));
const EditAccountScreen = React.lazy(() => import("./screens/App/Account/EditAccount"));
const AddressesScreen = React.lazy(() => import("./screens/App/Addresses"));
const AddAddressScreen = React.lazy(() =>
  import("./screens/App/Addresses/AddAddress")
);
const AddressMapViewScreen = React.lazy(() =>
  import("./screens/App/Addresses/AddressMapView")
);

// orders
const OrdersScreen = React.lazy(() => import("./screens/App/Orders"));
const OrderDetailsScreen = React.lazy(() => import("./screens/App/Orders/OrderDetails"));

// customised theme
const myTheme = extendTheme({
  colors: {
    // Add new color
    primary: {
      50: "#edfcf6",
      100: "#B9F3DC",
      200: "#A8F0D3",
      300: "#73E7B9",
      400: "#51E1A7",
      500: "#188C5D",
      600: "#157A52",
      700: "#0F573A",
      800: "#062317",
      900: "#03110B",
    },
    white: "#fcfefc",
    secondary: '#a1cd42'
  },
  fontConfig: {
    Junge: {
      100: {
        normal: "Junge",
        italic: "Junge",
      },
      200: {
        normal: "Junge",
        italic: "Junge",
      },
      300: {
        normal: "Junge",
        italic: "Junge",
      },
      400: {
        normal: "Junge",
        italic: "Junge",
      },
      500: {
        normal: "Junge",
        italic: "Junge",
      },
      600: {
        normal: "Junge",
        italic: "Junge",
      },
    },
  },
  fonts: {
    heading: "Junge",
  },
});

const AppLoadingScreen = () => (
  <Box height="100%" alignItems="center" justifyContent="center" bg="muted.100">
    <Text>Loading... Plase wait</Text>
  </Box>
);

const AppStack = createNativeStackNavigator();

const MarketWatchStack = createNativeStackNavigator();

const ChatStack = createNativeStackNavigator();

const ShopStack = createNativeStackNavigator();

const ProfileStack = createNativeStackNavigator();

const AppTabNavigator = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

function AppTabRouter() {
  const { colors } = useTheme();
  const tabHiddenRoutes = [
    "addToWatch",
    "Chat",
    "ProductDetails",
    "Cart",
    "Checkout",
    "AddressMapView",
    "AddAddress",
    "OrderConfirmation",
    "OrderDetails",
    "EditAccount",
  ];
  return (
    <AppTabNavigator.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          height: 100,
          // borderBottomWidth: 0.5,
          borderColor: colors.dark[500],
        },
        tabBarActiveTintColor: colors.white,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))
            ? "none"
            : "flex",
          position: "absolute",
          height: 50,
          backgroundColor: colors.primary[500],
          bottom: 16,
          left: 16,
          right: 16,
          elevation: 0,
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
          borderBottomRightRadius: 16,
          borderBottomLeftRadius: 16,
        },
      })}
    >
      <AppTabNavigator.Screen
        name="MarketWatch"
        component={MarketWatchRouter}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <VStack alignItems="center" space={1}>
                <MaterialCommunityIcons
                  size={focused ? 14 : 12}
                  name={focused ? "chart-box" : "chart-box-outline"}
                  color={focused ? colors.light[100] : colors.light[300]}
                />
                <Text color={focused ? colors.light[100] : colors.light[300]}>
                  Watcher
                </Text>
              </VStack>
            );
          },
        }}
      />
      <AppTabNavigator.Screen
        name="ChatUsersList"
        component={ChatRouter}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <VStack alignItems="center" space={1}>
                <MaterialCommunityIcons
                  size={focused ? 14 : 12}
                  name={focused ? "message" : "message-outline"}
                  color={focused ? colors.light[100] : colors.light[300]}
                />
                <Text color={focused ? colors.light[100] : colors.light[300]}>
                  Chat
                </Text>
              </VStack>
            );
          },
        }}
      />
      <AppTabNavigator.Screen
        name="ShopRouter"
        component={ShopRouter}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <VStack alignItems="center" space={1}>
                <MaterialCommunityIcons
                  size={focused ? 14 : 12}
                  name={focused ? "shopping" : "shopping-outline"}
                  color={focused ? colors.light[100] : colors.light[300]}
                />
                <Text color={focused ? colors.light[100] : colors.light[300]}>
                  Shop
                </Text>
              </VStack>
            );
          },
        }}
      />
      <AppTabNavigator.Screen
        name="ProfileRouter"
        component={ProfileRouter}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return (
              <VStack alignItems="center" space={1}>
                <MaterialCommunityIcons
                  size={focused ? 14 : 12}
                  name={focused ? "account" : "account-outline"}
                  color={focused ? colors.light[100] : colors.light[300]}
                />
                <Text color={focused ? colors.light[100] : colors.light[300]}>
                  Profile
                </Text>
              </VStack>
            );
          },
        }}
      />
    </AppTabNavigator.Navigator>
  );
}

function MarketWatchRouter() {
  const { colors } = useTheme();
  return (
    <MarketWatchStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <MarketWatchStack.Screen
        name="marketwatch"
        component={MarketWatchScreen}
        options={{
          headerTitle: "Market Watch",
        }}
      />
      <MarketWatchStack.Screen
        name="addToWatch"
        component={AddToWatchScreen}
        options={(props) => ({
          headerTitle: "Add to Watch",
        })}
      />
    </MarketWatchStack.Navigator>
  );
}

function ChatRouter() {
  const { colors } = useTheme();
  return (
    <ChatStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <ChatStack.Screen name="Chats" component={ChatUsersListScreen} />
      <ChatStack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <Text fontSize="20" textTransform="capitalize">
              {route.params?.receiver?.firstname}{" "}
              {route.params?.receiver?.lastname}
            </Text>
          ),
        })}
      />
    </ChatStack.Navigator>
  );
}

function ShopRouter() {
  const { colors } = useTheme();
  const { cart } = useSelector((state) => state.cartReducer);
  return (
    <ShopStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <ShopStack.Screen
        name="Shop"
        component={ShopScreen}
        options={({ navigation }) => ({
          headerRight: () => {
            return (
              <Button
                variant="primary"
                onPress={() => navigation.navigate("Cart")}
                startIcon={<MaterialIcons name="shopping-basket" size={16} />}
              >
                {cart.length + " Items"}
              </Button>
            );
          },
        })}
      />
      <ShopStack.Screen
        name="ProductDetails"
        options={{ presentation: "modal", headerShown: false }}
        component={ProductDetailsModal}
      />
      <ShopStack.Screen name="Cart" options={{}} component={CartScreen} />
      <ShopStack.Screen
        name="Checkout"
        options={{}}
        component={CheckoutScreen}
      />
      <ShopStack.Screen
        name="OrderConfirmation"
        options={{
          headerShown: false
        }}
        component={OrderConfirmationScreen}
      />
      <ShopStack.Screen
        name="OrderTracker"
        component={OrderTrackerScreen}
      />
    </ShopStack.Navigator>
  );
}

function ProfileRouter() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { reset } = useNavigation();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("farmers_app_token");
      dispatch(unsetCredentials());
      reset({
        index: 0,
        routes: [
          {
            name: "Login",
          },
        ],
      });
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <ProfileStack.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerTitle: "Profile",
          headerRight: () => {
            return (
              <Button
                variant="ghost"
                onPress={handleLogout}
                leftIcon={
                  <MaterialCommunityIcons
                    name="logout"
                    size={16}
                    color={colors.primary[500]}
                  />
                }
              >
                Logout
              </Button>
            );
          },
        }}
      />
      <ProfileStack.Screen
        name="EditAccount"
        component={EditAccountScreen}
        options={{
          headerTitle: "Edit Account",
        }}
      />
      <ProfileStack.Screen
        name="Addresses"
        component={AddressesScreen}
        options={({ navigation }) => ({
          headerTitle: "Address",
          headerRight: () => {
            return (
              <IconButton onPress={() => navigation.navigate('AddAddress')} icon={<Icon as={MaterialCommunityIcons} name="plus" size={6}/>}/>
            )
          }
        })}
      />
      <ProfileStack.Screen
        name="AddAddress"
        component={AddAddressScreen}
        options={{
          headerTitle: "Add Address",
        }}
      />
      <ProfileStack.Screen
        name="AddressMapView"
        component={AddressMapViewScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="Orders"
        component={OrdersScreen}
      />
      <ProfileStack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
      />
    </ProfileStack.Navigator>
  );
}

function AppRouter() {
  const dispatch = useDispatch();
  const { isAuthenticating, user, accessToken } = useSelector(
    (state) => state.authReducer
  );
  const { isIntro } = useSelector((state) => state.introReducer);
  let [fontsLoaded, setFontLoaded] = useState(false);
  let [customTheme, setCustomTheme] = useState(null);

  React.useEffect(() => {
    checkAuth();
    loadFonts();
    accessToken && dispatch(startConnecting());
  }, [startConnecting, accessToken]);

  const loadFonts = async () => {
    await Font.loadAsync({
      Junge: require("./assets/fonts/Junge-Regular.ttf"),
    });
    setCustomTheme(myTheme);
    setFontLoaded(true);
  };

  const checkAuth = React.useCallback(async () => {
    try {
      let token =
        accessToken ?? (await SecureStore.getItemAsync("farmers_app_token"));
      dispatch(restoreAuthentication({ accessToken: token }));
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.LONG);
    }
  }, [restoreAuthentication, accessToken]);

  return (
    customTheme && (
      <NativeBaseProvider theme={customTheme}>
        {isAuthenticating && !fontsLoaded ? (
          <AppLoadingScreen />
        ) : isIntro ? (
          <Landing />
        ) : (
          <React.Suspense
            fallback={
              <View>
                <Text>Loading</Text>
              </View>
            }
          >
            <NavigationContainer>
              <AppStack.Navigator
                screenOptions={{
                  headerShadowVisible: false,
                }}
              >
                <AppStack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <AppStack.Screen
                  name="Home"
                  component={AppTabRouter}
                  options={{
                    headerShown: false,
                  }}
                />
              </AppStack.Navigator>
            </NavigationContainer>
          </React.Suspense>
        )}
      </NativeBaseProvider>
    )
  );
}
