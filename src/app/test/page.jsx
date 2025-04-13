"use client";
import { useMusicPlayer } from "../context/NewContext";

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
      <h2>🎧 Favorite Songs</h2>
      {favorites.length === 0 ? (
        <p className="empty">You haven’t added any songs yet.</p>
      ) : (
        <ul className="playlist">
          {favorites.map((song, index) => (
            <li key={index} className="playlist-item">
              <div className="info" onClick={() => play(song, favorites,albumCover, index)}>
                <img src={albumCover} alt={song.songName} className="cover" />
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
