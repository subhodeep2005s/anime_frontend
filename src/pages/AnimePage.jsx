import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayIcon, BookmarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

function AnimePage() {
  const { animeId } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch(`https://anime-backend-dz2k.onrender.com/api/anime/${animeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch anime data');
        }
        const data = await response.json();
        setAnime(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, [animeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {error || 'Anime not found'}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="text-orange-500 hover:text-orange-600 flex items-center gap-2"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Determine the download link based on type
  const downloadLink = anime.type === 'Movie' ? anime.downloadLink : anime.episodes[0]?.downloadLink;

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <img
          src={anime.image}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {anime.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {anime.genre.map((g, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <p className="text-lg text-gray-300 max-w-2xl mb-6">
                {anime.description}
              </p>
              <div className="flex items-center gap-4">
                <a
                  href={downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-sm flex items-center gap-2"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Download Now</span>
                </a>
                <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-sm">
                  <BookmarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      {anime.type === 'Series' && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Episodes</h2>
            <div className="grid gap-4">
              {anime.episodes.map((episode) => (
                <div
                  key={episode._id}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-semibold">
                        {episode.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Episode: {episode.number}
                      </p>
                    </div>
                    <a
                      href={episode.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-sm text-sm"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Details Section */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h3 className="text-gray-400 text-sm">Status</h3>
            <p className="text-white">{anime.status}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm">Year</h3>
            <p className="text-white">{anime.year}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm">Rating</h3>
            <p className="text-white">{anime.rating}/5.0</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm">Episodes</h3>
            <p className="text-white">{anime.episodes.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimePage;
