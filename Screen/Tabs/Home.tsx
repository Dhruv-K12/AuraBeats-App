import {
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MusicContainer from "../../components/MusicContainer";
import { song } from "../../song";
import { useMainCtx } from "../../context/Main";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import Slider from "@react-native-community/slider";

export const songChangeHandler = (ctx: any, i: number) => {
  ctx.player.replace(ctx.songs[i].src);
  ctx.setCurrSong(ctx.songs[i].name);
};
const Home = () => {
  const ctx = useMainCtx();
  const input = useSharedValue(0);
  const [searchVal, setSearchVal] = useState("");
  const [img, setImg] = useState<ImageSourcePropType>();
  const [details, setDetails] = useState<any>({});
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();
  const animateCd = useSharedValue(0);
  const cdStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: animateCd.value + "deg" }],
    };
  });
  useEffect(() => {
    ctx?.setSongs(song);
  }, []);
  useEffect(() => {
    if (ctx?.songRunning) {
      animateCd.value = withRepeat(
        withTiming(360, {
          duration: 2000,
        }),
        Infinity,
        false
      );
    }
    return () => {
      animateCd.value = withSpring(0);
    };
  }, [ctx?.songRunning]);
  useEffect(() => {
    const currSong = song.find(
      (each) => each.name === ctx?.currSong
    );
    const eachName = song.map((each) => each.name);
    const name =
      typeof currSong?.name == "string"
        ? currSong?.name
        : "";
    setImg(currSong?.img);
    setDetails({
      ...currSong,
      index: eachName.indexOf(name),
    });
  }, [ctx?.currSong]);
  useEffect(() => {
    if (ctx?.status.didJustFinish && ctx.loop) {
      const songs = song.find(
        (each) => each.name == ctx?.currSong
      );
      ctx.player.replace(songs?.src);
    }
    if (ctx?.status.didJustFinish && !ctx.loop) {
      ctx?.setIndex((i) => {
        if (i == ctx?.songs.length - 1) {
          songChangeHandler(ctx, 0);
          return 0;
        } else {
          songChangeHandler(ctx, i + 1);
          return i + 1;
        }
      });
    }
  }, [ctx?.status.didJustFinish]);
  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleX: input.value }],
      width: `${interpolate(input.value, [0, 1], [0, 90])}%`,
    };
  });
  return (
    <LinearGradient
      colors={["#5D2828", "#FF6D6D"]}
      style={{ flex: 1 }}
    >
      <View style={styles.topContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome
            name="music"
            size={24}
            color="white"
          />
          <Text style={styles.titleText}>Songs</Text>
        </View>
        <Animated.View
          style={[
            {
              backgroundColor: "white",
              width: "90%",
              position: "absolute",
              borderRadius: 10,
              marginTop: 10,
            },
            inputStyle,
          ]}
        >
          <TextInput
            value={searchVal}
            placeholder="Search Your Song Here"
            onChangeText={(val) => setSearchVal(val)}
            style={{ width: "100%" }}
          />
        </Animated.View>
        <FontAwesome
          onPress={() => {
            setSearchVal("");
            input.value = withSpring(
              input.value == 0 ? 1 : 0
            );
          }}
          name="search"
          size={24}
          color="white"
        />
      </View>
      <FlatList
        data={
          searchVal.trim().length === 0
            ? ctx?.songs
            : ctx?.songs.filter((each) =>
                each.name
                  .toLowerCase()
                  .includes(searchVal.toLowerCase())
              )
        }
        renderItem={({ item, index }) => (
          <MusicContainer
            name={item.name}
            img={item.img}
            src={item.src}
            artistname={item.Artistname}
            tag={"image" + index}
            index={index}
            favourite={item.isFav}
          />
        )}
      />
      {ctx?.currSong && (
        <Pressable
          onPress={() => {
            ctx?.isSongChanged(false);
            navigation.navigate("MusicDetail", {
              name: details.name,
              img: details.img,
              src: details.src,
              Artistname: details.Artistname,
              favourite: details.favourite,
              index: details.index,
            });
          }}
        >
          <LinearGradient
            colors={["#8F5C5D", "#E3171A"]}
            start={{ x: 1, y: 0 }}
            locations={[0.2, 1]}
            style={{
              width: "90%",
              height: 66,
              alignSelf: "center",
              margin: 20,
              borderRadius: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Image
                source={img}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                }}
              ></Image>
              <Text style={{ fontSize: 25, margin: 10 }}>
                {ctx?.currSong}
              </Text>
              <Animated.View
                style={[
                  {
                    position: "relative",
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
              >
                <Feather
                  onPress={() => {
                    if (ctx?.songRunning) {
                      ctx?.player.pause();
                      ctx?.isSongRunning(false);
                    } else {
                      ctx?.player.play();
                      ctx?.isSongRunning(true);
                    }
                  }}
                  name={ctx?.songRunning ? "pause" : "play"}
                  size={27}
                  color="white"
                  style={{ margin: 14 }}
                />
                <Animated.View
                  style={[
                    { position: "relative" },
                    cdStyle,
                  ]}
                >
                  <Image
                    source={require("../../assets/image_1.png")}
                    style={{
                      width: 40,
                      height: 40,
                      alignItems: "center",
                    }}
                  />
                  <Image
                    source={img}
                    style={{
                      width: 20,
                      height: 20,
                      position: "absolute",
                      right: 10,
                      borderRadius: 10,
                      top: 10,
                    }}
                  />
                </Animated.View>
              </Animated.View>
            </View>
            <Slider
              maximumTrackTintColor="black"
              minimumTrackTintColor="white"
              thumbTintColor="transparent"
              value={ctx?.player.currentTime}
              onSlidingComplete={(value) =>
                ctx.player.seekTo(value)
              }
              maximumValue={ctx?.player.duration}
              minimumValue={0}
              style={{
                width: "100%",
                alignSelf: "center",
              }}
            />
          </LinearGradient>
        </Pressable>
      )}
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    alignItems: "center",
  },
  titleText: {
    color: "white",
    margin: 30,
    fontSize: 20,
  },
});
