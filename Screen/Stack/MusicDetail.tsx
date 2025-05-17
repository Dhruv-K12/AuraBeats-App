import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Slider from "@react-native-community/slider";
import { useMainCtx } from "../../context/Main";
import Foundation from "@expo/vector-icons/Foundation";
import {
  Easing,
  interpolate,
  StretchInY,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import Animated from "react-native-reanimated";
import { DefaultStyle } from "react-native-reanimated/lib/typescript/hook/commonTypes";
const MusicDetail = ({ route }: any) => {
  const {
    name,
    src,
    img,
    Artistname,
    tag,
    index,
    favourite,
    forwarded = false,
  } = route.params;
  const [fav, isFav] = useState(false);
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();
  const heartAnimation = useSharedValue(0);
  const ctx = useMainCtx();
  const playing = ctx?.player?.playing;
  const rotateCd = useSharedValue(0);
  const [currentTime, setCurrentTime] = useState("");
  const playAndPauseHandler = () => {
    if (playing && ctx?.currSong === name) {
      ctx?.player.pause();
      ctx?.isSongRunning(false);
    } else if (!playing && ctx?.currSong == name) {
      ctx?.isSongRunning(true);
      ctx?.player.play();
    } else {
      ctx?.player.replace(src);
      ctx?.player.play();
      ctx?.setCurrSong(name);
      ctx?.isSongRunning(true);
    }
  };
  const cdStyle: DefaultStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate:
            interpolate(rotateCd.value, [0, 1], [0, 360]) +
            "deg",
        },
      ],
    };
  });
  const sliderHandler = (value: number) => {
    if (ctx?.currSong === name) {
      ctx?.player.seekTo(Math.floor(value));
    }
  };
  const animateHeart = () => {
    isFav((state) => !state);
    ctx?.setSongs((song) =>
      song.map((each) =>
        each.name === name
          ? { ...each, isFav: !each.isFav }
          : each
      )
    );
    !fav &&
      ToastAndroid.show(
        "Added To Favourite",
        ToastAndroid.SHORT
      );
    heartAnimation.value = withSpring(1);
  };
  const formatDuration = () => {
    if (ctx?.player.duration) {
      const minute = Math.floor(ctx?.player.duration / 60);
      const seconds = Math.floor(ctx?.player.duration % 60);
      const txt = `${minute} : ${seconds >= 10 ? seconds : "0" + seconds}`;
      return txt;
    }
    return "";
  };
  const loopHandler = () => {
    ctx?.isLoop((state) => {
      ToastAndroid.show(
        state ? "Loop mode is off" : "Loop mode is on",
        ToastAndroid.SHORT
      );
      return !state;
    });
  };
  const prevAndNextHandler = (e: string) => {
    if (
      typeof ctx?.songs[
        e == "prev" ? ctx.index - 1 : ctx.index + 1
      ] !== "undefined"
    ) {
      navigation.replace("MusicDetail", {
        ...ctx.songs[
          e == "prev" ? ctx.index - 1 : ctx.index + 1
        ],
        index: e == "prev" ? ctx.index - 1 : ctx.index + 1,
        forwarded: true,
      });
    }
  };
  useEffect(() => {
    if (forwarded) playAndPauseHandler();
    isFav(favourite);
    ctx?.setIndex(index);
    ctx?.isSongChanged(false);
  }, []);
  const navigate = (nextSong: any, i: number) => {
    navigation.replace("MusicDetail", {
      ...nextSong,
      index: i,
    });
  };
  useEffect(() => {
    if (
      ctx?.status.didJustFinish &&
      !ctx?.songChange &&
      !ctx?.loop
    ) {
      if (
        typeof ctx?.songs[ctx?.index + 1] !== "undefined"
      ) {
        navigate(
          ctx?.songs[ctx?.index + 1],
          ctx?.index + 1
        );
      } else {
        navigate(ctx?.songs[0], 0);
      }
      ctx.isSongChanged(true);
    }
  }, [ctx?.status.didJustFinish]);

  useEffect(() => {
    const current = ctx?.player?.currentTime;

    if (
      ctx?.player?.duration &&
      typeof current === "number"
    ) {
      const minutes = Math.floor(current / 60);
      const seconds = Math.floor(current % 60);
      const formatted = `${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`;
      setCurrentTime(formatted);
    }
  }, [ctx?.status.currentTime]);

  useEffect(() => {
    if (playing && ctx?.currSong === name) {
      rotateCd.value = withRepeat(
        withTiming(1, {
          duration: 2000,
        }),
        Infinity,
        false
      );
    } else {
      rotateCd.value = withSpring(0);
    }
  }, [playing]);
  return (
    <LinearGradient
      colors={["#5D2828", "#FF6D6D"]}
      style={{ flex: 1 }}
    >
      <AntDesign
        onPress={animateHeart}
        name={fav ? "heart" : "hearto"}
        size={20}
        color="white"
        style={{
          alignSelf: "flex-end",
          marginTop: 40,
          marginRight: 20,
        }}
      />
      <View style={{ justifyContent: "flex-start" }}>
        <Animated.Image
          source={img}
          style={styles.img}
          sharedTransitionTag={tag}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={[
            { position: "relative", flexDirection: "row" },
            cdStyle,
          ]}
        >
          <Image
            source={require("../../assets/image_1.png")}
            style={{
              width: 58,
              height: 58,
              alignItems: "center",
            }}
          />
          <Image
            source={img}
            style={{
              width: 20,
              height: 20,
              position: "absolute",
              borderRadius: 20,
              left: 19,
              top: 19,
            }}
          />
        </Animated.View>
        <Animated.Text
          entering={StretchInY.duration(600).easing(
            Easing.bounce
          )}
          style={[{ color: "white", fontSize: 35 }]}
        >
          {name}
        </Animated.Text>
        <Text
          style={{
            color: "#E1CBCB",
            position: "absolute",
            left: 65,
            top: 50,
          }}
        >
          {Artistname}
        </Text>
      </View>
      <Slider
        style={{
          width: "95%",
          height: 10,
          alignSelf: "center",
          marginTop: 40,
        }}
        minimumValue={0}
        maximumValue={ctx?.player.duration}
        value={
          ctx?.currSong == name
            ? ctx?.player.currentTime
            : 0
        }
        minimumTrackTintColor="white"
        maximumTrackTintColor="black"
        thumbTintColor="black"
        onSlidingComplete={(value) => sliderHandler(value)}
      />
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          marginHorizontal: 15,
        }}
      >
        <Text style={{ color: "whitesmoke", fontSize: 13 }}>
          {ctx?.currSong === name && currentTime}
        </Text>
        <Text style={{ color: "whitesmoke", fontSize: 13 }}>
          {ctx?.currSong === name && formatDuration()}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          margin: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => prevAndNextHandler("prev")}
        >
          <AntDesign
            name="banckward"
            size={30}
            color="black"
          />
        </TouchableOpacity>
        <Pressable onPress={playAndPauseHandler}>
          <AntDesign
            name={
              ctx?.currSong === name &&
              ctx?.player.currentStatus.playing
                ? "pausecircle"
                : "play"
            }
            size={60}
            color="black"
          />
        </Pressable>
        <TouchableOpacity
          onPress={() => prevAndNextHandler("next")}
        >
          <AntDesign
            name="forward"
            size={30}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <View style={{ alignSelf: "center", margin: 10 }}>
        <Foundation
          onPress={loopHandler}
          name="loop"
          size={40}
          color={ctx?.loop ? "white" : "black"}
        />
      </View>
    </LinearGradient>
  );
};

export default MusicDetail;

const styles = StyleSheet.create({
  img: {
    width: "95%",
    height: 350,
    alignSelf: "center",
    borderRadius: 20,
    margin: 20,
    resizeMode: "stretch",
  },
});
