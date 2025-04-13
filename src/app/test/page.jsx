"use client";
import { useMusicPlayer } from "../context/NewContext";
import Image from "next/image";
import "../styles/playlist.css"
export default function Playlist() {
  const { favorites, play, setFavorites,albumCover } = useMusicPlayer();

  const handleRemove = (songToRemove) => {
    setFavorites((prev) =>
      prev.filter(
        (song) =>
          song.songName !== songToRemove.songName ||
          song.artistName !== songToRemove.artistName
      )
    );
  };

  return (
    <div className="playlist-container" style={{marginTop:"100px"}}>
      <div>

      <h2 className="text-4xl font-bold text-center mb-4">🎧 Favorite Songs</h2>
      </div>
      {favorites.length === 0 ? (
        <p className="empty">You haven’t added any songs yet.</p>
      ) : (
        <ul className="playlist">
          {favorites.map((song, index) => (
            <li key={index} className="playlist-item">
              <div className="info" onClick={() => play(song, favorites,albumCover, index)}>
                <Image src="https://sonos-partner-documentation.s3.amazonaws.com/ReadMe-External/content-service-features/add-images/add-album-art/SonosApp-DefaultArt-Alone.png" alt={song.songName} className="cover" width={100} height={100}/>
                <div>
                  <h4>{song.songName}</h4>
                  <p>{song.artistName}</p>
                </div>
              </div>
              <button onClick={() => handleRemove(song)} className="remove-btn">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
