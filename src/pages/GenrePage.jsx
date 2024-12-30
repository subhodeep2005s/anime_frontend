import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function GenrePage() {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { genre } = useParams();

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch('https://anime-backend-dz2k.onrender.com/api/anime');
        if (!response.ok) {
          throw new Error('Failed to fetch anime data');
        }
        const data = await response.json();
        const filteredData = data.filter(anime => 
          anime.genre && anime.genre.map(g => g.toLowerCase()).includes(genre.toLowerCase())
        );
        setAnimeData(filteredData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, [genre]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-white capitalize">{genre} Anime</h2>
        {animeData.length === 0 ? (
          <div className="text-white text-xl">No anime found for this genre.</div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default GenrePage;

