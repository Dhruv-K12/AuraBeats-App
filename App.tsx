import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import {
  ImageSourcePropType,
  SafeAreaView,
  SafeAreaViewComponent,
  StyleSheet,
} from "react-native";
import Home from "./Screen/Tabs/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Favourite from "./Screen/Tabs/Favourite";
import MusicDetail from "./Screen/Stack/MusicDetail";
import {
  MainCtxProvider,
  useMainCtx,
} from "./context/Main";

export type RootStackParamList = {
  Tabs: undefined;
  MusicDetail: {
    name: string;
    img: ImageSourcePropType;
    src: string;
    Artistname: string;
    tag?: string;
    index?: number;
    favourite?: boolean;
    forwarded?: boolean;
  };
};
type RootTabsParamList = {
  Home: undefined;
  Favourite: undefined;
};
const Stack =
  createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<RootTabsParamList>();
export const MyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="Tabs" component={MyTabs} />
      <Stack.Screen
        name="MusicDetail"
        component={MusicDetail}
      />
    </Stack.Navigator>
  );
};
export const MyTabs = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#7B3535",
          height: 60,
        },
        tabBarActiveTintColor: "#FB6C6C",
      }}
    >
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: () => (
            <FontAwesome
              name="home"
              size={30}
              color="white"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Favourite"
        component={Favourite}
        options={{
          tabBarIcon: () => (
            <FontAwesome
              name="heart"
              size={25}
              color="white"
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MainCtxProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MyStack />
        </NavigationContainer>
      </MainCtxProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
