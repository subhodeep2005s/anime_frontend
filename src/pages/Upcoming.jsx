// import React from 'react';

// function Upcoming() {
//   const upcomingAnime = [
//     { id: 1, title: 'Upcoming Anime 1', releaseDate: '2023-12-01', poster: 'https://i.pinimg.com/736x/49/a4/f3/49a4f36fc1f496a7a804047715ed60c9.jpg' },
//     { id: 2, title: 'Upcoming Anime 2', releaseDate: '2023-12-15', poster: 'https://i.pinimg.com/736x/c2/c6/b5/c2c6b5db3810edaed961cdf3c8d28596.jpg' },
//     { id: 3, title: 'Upcoming Anime 3', releaseDate: '2024-01-05', poster: 'https://i.pinimg.com/736x/84/6c/d0/846cd0fae3dff07a325e7c1befa517d2.jpg' },
//     { id: 1, title: 'Upcoming Anime 1', releaseDate: '2023-12-01', poster: 'https://i.pinimg.com/736x/49/a4/f3/49a4f36fc1f496a7a804047715ed60c9.jpg' },
//     { id: 2, title: 'Upcoming Anime 2', releaseDate: '2023-12-15', poster: 'https://i.pinimg.com/736x/c2/c6/b5/c2c6b5db3810edaed961cdf3c8d28596.jpg' },
//     { id: 3, title: 'Upcoming Anime 3', releaseDate: '2024-01-05', poster: 'https://i.pinimg.com/736x/84/6c/d0/846cd0fae3dff07a325e7c1befa517d2.jpg' },
//     { id: 1, title: 'Upcoming Anime 1', releaseDate: '2023-12-01', poster: 'https://i.pinimg.com/736x/49/a4/f3/49a4f36fc1f496a7a804047715ed60c9.jpg' },
//     { id: 2, title: 'Upcoming Anime 2', releaseDate: '2023-12-15', poster: 'https://i.pinimg.com/736x/c2/c6/b5/c2c6b5db3810edaed961cdf3c8d28596.jpg' },
//     { id: 3, title: 'Upcoming Anime 3', releaseDate: '2024-01-05', poster: 'https://i.pinimg.com/736x/84/6c/d0/846cd0fae3dff07a325e7c1befa517d2.jpg' },
//   ];

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-4">Upcoming Anime</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {upcomingAnime.map(anime => (
//           <div key={anime.id} className="border rounded-lg p-4">
//             <img src={anime.poster} alt={anime.title} className="w-full rounded-lg shadow-lg" />
//             <h2 className="text-xl font-semibold mt-2">{anime.title}</h2>
//             <p className="text-gray-600">Release Date: {anime.releaseDate}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Upcoming;


import React, { useState, useEffect } from 'react';

function Upcoming() {
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch('https://anime-backend-dz2k.onrender.com/api/anime');
        if (!response.ok) {
          throw new Error('Failed to fetch anime data');
        }
        const data = await response.json();
        const upcoming = data.filter(anime => anime.status === 'Upcoming');
        setUpcomingAnime(upcoming);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Upcoming Anime</h1>
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Upcoming Anime</h1>
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Upcoming Anime</h1>
      {upcomingAnime.length === 0 ? (
        <p className="text-xl">No upcoming anime found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingAnime.map(anime => (
            <div key={anime.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
              <img src={anime.image} alt={anime.title} className="w-full h-64 object-cover rounded-lg shadow-lg mb-4" />
              <h2 className="text-xl font-semibold mb-2">{anime.title}</h2>
              <p className="text-gray-400 mb-2">Status: {anime.status}</p>
              {anime.releaseDate && (
                <p className="text-gray-400">
                  Release Date: {new Date(anime.releaseDate).toLocaleDateString()}
                </p>
              )}
              {anime.genre && anime.genre.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-400 mb-1">Genres:</p>
                  <div className="flex flex-wrap gap-2">
                    {anime.genre.map((genre, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-sm rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Upcoming;

