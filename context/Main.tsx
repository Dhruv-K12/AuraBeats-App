import {
  AudioPlayer,
  AudioStatus,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { createContext, useContext, useState } from "react";
import { ImageSourcePropType } from "react-native";
type context = {
  player: AudioPlayer;
  setSource: React.Dispatch<React.SetStateAction<string>>;
  songRunning: boolean;
  isSongRunning: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  source: string;
  songs: songType[];
  setSongs: React.Dispatch<
    React.SetStateAction<songType[]>
  >;
  currSong: string;
  setCurrSong: React.Dispatch<React.SetStateAction<string>>;
  songChange: boolean;
  isSongChanged: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  status: AudioStatus;
  loop: boolean;
  isLoop: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MainCtx = createContext<context | undefined>(
  undefined
);

type props = {
  children: React.ReactNode;
};
export interface songType {
  name: string;
  img: ImageSourcePropType;
  src: string;
  Artistname: string;
  isFav: boolean;
}
export const MainCtxProvider = ({ children }: props) => {
  const [source, setSource] = useState(
    require("../assets/music/ANTIDOTE - Karan Aujla.mp3")
  );
  const [songRunning, isSongRunning] = useState(false);
  const player = useAudioPlayer(source, 1000);
  const status = useAudioPlayerStatus(player);
  const [songs, setSongs] = useState<songType[]>([]);
  const [currSong, setCurrSong] = useState("");
  const [songChange, isSongChanged] = useState(false);
  const [index, setIndex] = useState(0);
  const [loop, setLoop] = useState(false);
  const value = {
    player,
    setSource,
    songRunning,
    isSongRunning,
    source,
    setSongs,
    songs,
    currSong,
    setCurrSong,
    songChange,
    isSongChanged,
    index,
    setIndex,
    status,
    loop,
    isLoop: setLoop,
  };
  return (
    <MainCtx.Provider value={value}>
      {children}
    </MainCtx.Provider>
  );
};
export const useMainCtx = () => {
  const ctx = useContext(MainCtx);
  if (typeof ctx == null) {
    console.log("not working");
  }
  return ctx;
};
