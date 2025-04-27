"use client";

import React, { useEffect, useState } from "react";
import { useMusicPlayer } from "../context/NewContext"; // adjust path if different
import Link from "next/link";
import axios from "axios";

const Hot100 = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { play } = useMusicPlayer(); // Import the play function from your context

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch("/api/albums/hot100"); // Make sure your API sends proper data
        const data = await res.json();
        
        setSongs(data);
      } catch (error) {
        console.error("Failed to load songs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl">
        Loading Hot 100...
      </div>
    );
  }

  const handleClick = async (e, song, index) => {
    e.preventDefault();
    
    try {
        // Fetch the download link from the API
        const res = await axios.get(`/api/albums/hot100/singlesong?link=${encodeURIComponent(song.link)}`);
        const downloadLink = res.data;
        
        console.log("Received Download Link:", downloadLink); // Debug the link

        if (downloadLink) {
            play(downloadLink, songs, song.img, index); // Play the song
        } else {
            console.log("No valid download link found");
        }
    } catch (error) {
        console.error("Error fetching song:", error);
    }
};


  return (
    <div className="min-h-screen bg-gray-900 text-white py-20 px-5">
      <h1 className="text-4xl font-bold text-center mb-10">🔥 Hot 100 Songs</h1>
      <p className="text-xl font-bold text-center mb-10">Double Click on the song am working on how to fix it.Click even when the player is loading</p>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {songs.map((song, index) => (
          <a
            onClick={(e) => handleClick(e, song, index)}
            key={index}
            href="#"
            className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transform transition-all shadow-lg hover:shadow-2xl cursor-pointer"
          >
            <img
              src={song.img}
              alt={song.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-pink-600 rounded-full px-2 py-1">
                  #{song.badge}
                </span>
                <span className="text-xs">{song.downloads}</span>
              </div>
              <h2 className="text-lg font-semibold">{song.title}</h2>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Hot100;
