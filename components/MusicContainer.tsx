import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import Animated from "react-native-reanimated";

type props = {
  name: string;
  src: string;
  img: ImageSourcePropType;
  artistname: string;
  tag: string;
  index: number;
  favourite: boolean;
};
const MusicContainer = ({
  name,
  src,
  img,
  artistname,
  tag,
  index,
  favourite,
}: props) => {
  type navigationProp =
    NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<navigationProp>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("MusicDetail", {
          name,
          src,
          img,
          Artistname: artistname,
          tag,
          index,
          favourite,
        })
      }
      style={styles.musicContainer}
    >
      <Animated.Image
        source={img}
        style={styles.img}
        sharedTransitionTag={tag}
      />
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

export default MusicContainer;

const styles = StyleSheet.create({
  musicContainer: {
    width: "95%",
    height: 100,
    backgroundColor: "#000000",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    margin: 8,
  },
  img: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  text: {
    color: "#FF2064",
    fontSize: 26,
    margin: 30,
  },
});
