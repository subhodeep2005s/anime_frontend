


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimeCarousel from '../components/AnimeCarousel';
// import { featured } from '../data/animeData'; 

function Home() {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch('https://anime-backend-dz2k.onrender.com/api/anime');
        if (!response.ok) {
          throw new Error('Failed to fetch anime data');
        }
        const data = await response.json();
        setAnimeData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Error: {error}</div>;
  }

  const featuredAnime = animeData.slice(0, 5); // Assuming we want to feature the first 5 anime

  return (
    <div className="min-h-screen bg-gray-900">
      <AnimeCarousel animeData={featuredAnime} />

      {/* Masonry Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Popular Anime</h2>
        <div className="masonry-grid">
          {animeData.map((anime) => (
            <div
              key={anime.id}
              className="masonry-item break-inside-avoid mb-4"
            >
              <Link to={`/anime/${anime.id}`} className="block group">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300">
                    <h3 className="text-white text-lg font-semibold">
                      {anime.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

