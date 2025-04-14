"use client"
import React from 'react'
import SearchBar from '../components/Homepage/SearchBar'
import { useEffect ,useState} from 'react'
import AlbumCards from '../components/card/AlbumCards'
import axios from 'axios'
import '../styles/singleCard.css';
const HindiPage = () => {
    const [albums,setAlbums]=useState([])
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [page,setPage]=useState(1)
    const [totalPages,setTotalPages]=useState(100)
    const [searchQuery,setSearchQuery]=useState('')

    const fetchAlbums=async()=>{
        setLoading(true)
        try{
            const response=await axios.get(`/api/hindi/pagalnew?page=${page}`)
            setAlbums(response.data.allDetails)
            console.log(response.data.allDetails)
        }catch(error){
            console.error('Error fetching albums:', error)
            setError(error)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
      console.log(albums)
        fetchAlbums()
    },[page,searchQuery])
  return (
    <>
    {loading && (
        <div className="loading-overlay">
            Loading Albums...
        </div>
    )}
    <div className=''>
        <SearchBar text="Looking for Boring Songs 😂" />
    </div>
    
    <div className="allCards">
        {loading && <p>Loading...</p>}
        {error && <p>Error loading albums.</p>}
       

        {albums.map((album, index) => (
          <AlbumCards  key={index} title={album.albumName} image={album.albumSongs[0].albumCover} link={album.albumLink} id={index} />
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
    
   
  )
}

export default HindiPage