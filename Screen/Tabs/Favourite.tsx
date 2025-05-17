import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useMainCtx } from "../../context/Main";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
const Favourite = () => {
  const ctx = useMainCtx();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();
  return (
    <LinearGradient
      colors={["#5D2828", "#FF6D6D"]}
      style={{ flex: 1, padding: 2 }}
    >
      <FlatList
        style={{ marginTop: 40 }}
        numColumns={2}
        data={ctx?.songs.filter(
          (each) => each.isFav && each
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MusicDetail", {
                name: item.name,
                img: item.img,
                favourite: item.isFav,
                src: item.src,
                Artistname: item.Artistname,
                tag: "",
                index: 1,
              });
            }}
            style={{
              width: "45%",
              height: 200,
              backgroundColor: "black",
              margin: 10,
              borderRadius: 20,
              alignItems: "center",
            }}
          >
            <Image
              source={item.img}
              style={{
                alignSelf: "center",
                width: 100,
                height: 100,
                margin: 10,
              }}
            />
            <Text
              style={{ color: "#FF2064", fontSize: 30 }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

export default Favourite;

const styles = StyleSheet.create({});
