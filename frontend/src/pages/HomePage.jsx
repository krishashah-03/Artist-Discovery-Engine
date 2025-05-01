import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [recommendedArtists, setRecommendedArtists] = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    const selectedGenres = JSON.parse(localStorage.getItem('selectedGenres')) || [];
    setUsername(storedName || '');

    const genreQuery = selectedGenres.join(',');

    fetch(`http://localhost/Artist-Discovery-Engine/backend/api/fetch-artists.php?genres=${encodeURIComponent(genreQuery)}`)
      .then(res => res.json())
      .then(data => setArtists(data))
      .catch(err => console.error('Error fetching artists:', err));
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        fetch(`http://localhost/Artist-Discovery-Engine/backend/api/test-api.php?q=${encodeURIComponent(search)}`)
          .then(res => res.json())
          .then(data => setArtists(data))
          .catch(err => console.error('Error fetching search results:', err));
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    let genreList = artist.genre.split(',').map(g => g.trim());

    let recommendations = artists.filter(
      (a) => a.name !== artist.name && genreList.some(g => a.genre.includes(g))
    );

    if (recommendations.length < 1) {
      recommendations = artists.filter((a) => a.name !== artist.name);
    }

    const uniqueRecommendations = Array.from(new Map(recommendations.map(a => [a.name, a])).values());
    setRecommendedArtists(uniqueRecommendations.slice(0, 5));
  };

  const closeModal = () => {
    setSelectedArtist(null);
    setRecommendedArtists([]);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 relative">
      <motion.div
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 1, filter: 'blur(0)' }}
        transition={{ duration: 1.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-extrabold mb-2 text-white drop-shadow-lg">
          Hello, {username} <span className="animate-wave">👋</span>
        </h1>
        <p className="text-gray-400 text-lg">Search for your favorite artists below</p>
      </motion.div>

      <div className="max-w-xl w-full mx-auto mb-8 relative">
        <FaSearch className="absolute top-3.5 left-4 text-gray-400 z-10" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for your favorite artist..."
          className="w-full px-10 py-3 rounded-lg bg-zinc-800 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {search.trim() && artists.length > 0 && (
          <ul className="absolute z-20 bg-zinc-800 w-full mt-1 rounded-md border border-zinc-700 max-h-60 overflow-y-auto">
            {artists.map((artist, index) => (
              <li
                key={index}
                onClick={() => {
                  setSearch(artist.name);
                  handleArtistClick(artist);
                }}
                className="px-4 py-2 hover:bg-zinc-700 cursor-pointer"
              >
                {artist.name}
              </li>
            ))}
          </ul>
        )}
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {artists.filter(a => a.name.toLowerCase().includes(search.toLowerCase())).slice(0, 50).map((artist, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden bg-zinc-900 shadow-md hover:scale-105 transition cursor-pointer"
            onClick={() => handleArtistClick(artist)}
          >
            <img
              src={artist.profile_picture_url}
              alt={artist.name}
              className="w-full h-40 object-cover blur-sm opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-xl font-bold text-white text-center px-2">
                {artist.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-zinc-900 p-6 rounded-xl shadow-xl max-w-4xl w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
                onClick={closeModal}
              >
                &times;
              </button>
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={selectedArtist.profile_picture_url}
                  alt={selectedArtist.name}
                  className="w-40 h-40 object-cover rounded-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedArtist.name}</h2>
                  <p className="text-gray-300">Genre: {selectedArtist.genre}</p>
                  <p className="text-gray-300">Location: {selectedArtist.location}</p>

                  {recommendedArtists.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Recommended Artists</h3>
                      <div className="flex gap-4 overflow-x-auto">
                        {recommendedArtists.map((rec, i) => (
                          <div
                            key={i}
                            className="min-w-[130px] bg-zinc-800 p-3 rounded-lg cursor-pointer hover:bg-zinc-700 text-center"
                            onClick={() => handleArtistClick(rec)}
                          >
                            <img
                              src={rec.profile_picture_url}
                              alt={rec.name}
                              className="w-full h-24 object-cover rounded mb-1"
                            />
                            <p className="text-sm text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                              {rec.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
