"use client";
import React, { useEffect, useState } from 'react';
import SearchBar from '../components/Homepage/SearchBar';
import AlbumCards from '../components/card/AlbumCards';
import '../styles/singleCard.css';

const EnglishAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // optional, if your API provides total

  const fetchAlbums = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/albums/latest?limit=16&page=${page}`);
      const data = await response.json();
      console.log(data);

      setAlbums(data.data); // assuming data.data is the array of albums
      setTotalPages(data.totalPages || 2000); // fallback if totalPages not in response
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums(page);
  }, [page]);

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div>
        <SearchBar text="Browse Latest Albums" />
      </div>

      <div className="allCards">
        {loading && <p>Loading...</p>}
        {error && <p>Error loading albums.</p>}
        {!loading && !error && filteredAlbums.length === 0 && <p>No albums found.</p>}

        {filteredAlbums.map((album, index) => (
          <AlbumCards  key={index} title={album.title} image={album.image} link={album.link} id={album.id} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls" style={{ textAlign: 'center', margin: '2rem 0',paddingBottom: '8rem' }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={{ marginRight: '1rem' }}
        >
          ◀ Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          style={{ marginLeft: '1rem' }}
        >
          Next ▶
        </button>
      </div>
    </>
  );
};

export default EnglishAlbums;
