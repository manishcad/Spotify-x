'use client';

import { createContext, useContext, useState, useRef } from 'react';
import { useEffect } from 'react';
const MusicPlayerContext = createContext();

export const useMusicPlayer = () => useContext(MusicPlayerContext);

export const MusicPlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [albumCover, setAlbumCover] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatOne, setRepeatOne] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const currentSong = songs[currentSongIndex];

  // Load favorites from localStorage when context initializes
  useEffect(() => {
    
    const storedFavorites = localStorage.getItem('favoriteSongs');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favoriteSongs', JSON.stringify(favorites));
  }, [favorites]);


  
  useEffect(() => {
    const newSong = songs[currentSongIndex];
    if (!newSong || !audioRef.current) return;
  
    console.log("Changing to new song:", newSong);
  
    // Update src and play
    audioRef.current.src = newSong.musicLink;
    audioRef.current.currentTime = 0;
  
    const playAttempt = audioRef.current.play();
  
    if (playAttempt !== undefined) {
      playAttempt
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Failed to play next song:", err);
          setIsPlaying(false);
        });
    }
  }, [currentSongIndex,songs]);
  const play = async (newSong, songList = [], coverImage, index) => {
    console.log("Playing song:", newSong);
    setAlbumCover(coverImage);
    setCurrentSongIndex(index);
    setIsVisible(true);
    setIsPlaying(true);
  
    if (!newSong || !audioRef.current) return;
  
    console.log("Playing song:", {
      songName: newSong?.songName,
      musicLink: newSong?.musicLink
    });
  
    try {
      // Stop current playback if any
      if (audioRef.current.src) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
  
      setSongs(songList);
  
      // Set new song source
      audioRef.current.src = newSong.musicLink || newSong.downloadLink;
  
      // Make sure the audio element is ready
      const handlePlay = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          console.log("Playback started successfully!");
        } catch (error) {
          console.error("Playback failed. Waiting for load event...", error);
          // If play fails, wait for metadata to load, then try again
          audioRef.current.onloadeddata = async () => {
            try {
              await audioRef.current.play();
              setIsPlaying(true);
            } catch (error) {
              console.error("Error playing song:", error);
              setIsPlaying(false);
            }
          };
        }
      };
  
      // Try playing the song right away
      await handlePlay();
  
    } catch (error) {
      console.error("Error playing song:", error);
      setIsPlaying(false);
    }
  };
  
  
  

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const toggleFavorite = (song) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some(
        (fav) => fav.songName === song.songName && fav.artistName === song.artistName
      );
  
      if (isAlreadyFavorite) {
        return prev.filter(
          (fav) => !(fav.songName === song.songName && fav.artistName === song.artistName)
        );
      } else {
        return [...prev, song];
      }
    });
  };

  const playNext = () => {
    console.log("Playing next song");

    if (!songs || songs.length === 0) return;

    if (isShuffled) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === currentSongIndex && songs.length > 1);

      setCurrentSongIndex(randomIndex);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    }

    setIsPlaying(true);
  };

  

  const playPrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const value = {
    audioRef,
    songs,
    setSongs,
    currentSong,
    currentSongIndex,
    setCurrentSongIndex,
    isPlaying,
    play,
    pause,
    playNext,
    playPrev,
    isMinimized,
    setIsMinimized,
    isVisible,
    setIsVisible,
    volume,
    setVolume,
    albumCover,
    setAlbumCover,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    updateTime,
    setIsPlaying,
    repeatOne,
    setRepeatOne,
    isShuffled,
    setIsShuffled,
    toggleFavorite,
    favorites,
    setFavorites,
  
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
