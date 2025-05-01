// src/pages/GenreSelection.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const genres = [
  { name: 'pop', icon: '🎤' },
  { name: 'rock', icon: '🎸' },
  { name: 'hip hop', icon: '🎧' },
  { name: 'r&b', icon: '🎷' },
  { name: 'soul', icon: '🧠' },
  { name: 'electro', icon: '🔌' },
  { name: 'grunge', icon: '💀' },
  { name: 'funk', icon: '🕺' },
  { name: 'dance pop', icon: '💃' },
  { name: 'garage rock', icon: '🚗' },
  { name: 'classic rock', icon: '📻' },
  { name: 'modern rock', icon: '🎚️' },
  { name: 'alternative rock', icon: '🤘' },
  { name: 'art rock', icon: '🎨' },
  { name: 'rap', icon: '🗣️' },
  { name: 'nu metal', icon: '🧱' },
  { name: 'melancholia', icon: '🌧️' },
  { name: 'urban contemporary', icon: '🏙️' },
  { name: 'oxford indie', icon: '🏫' },
  { name: 'britpop', icon: '🇬🇧' },
];

export default function GenreSelection() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggleGenre = (genre) => {
    if (selected.includes(genre)) {
      setSelected(selected.filter((g) => g !== genre));
    } else if (selected.length < 10) {
      setSelected([...selected, genre]);
    }
  };

  const handleContinue = () => {
    if (selected.length >= 3) {
      localStorage.setItem('selectedGenres', JSON.stringify(selected));
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black text-white px-4 py-8">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-6">Pick Your Favorite Genres</h1>
      <p className="text-center text-gray-400 mb-8">Choose at least 3 to continue</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {genres.map(({ name, icon }) => (
          <div
            key={name}
            onClick={() => toggleGenre(name)}
            className={`cursor-pointer p-4 rounded-xl text-center border transition 
              ${selected.includes(name) ? 'bg-green-600 border-green-400' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-600'}
            `}
          >
            <div className="text-3xl mb-2">{icon}</div>
            <p className="capitalize">{name}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <button
          className={`px-6 py-3 text-lg rounded-lg font-semibold transition ${
            selected.length >= 3
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
          onClick={handleContinue}
          disabled={selected.length < 3}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
