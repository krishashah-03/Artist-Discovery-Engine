import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (username.trim()) {
      localStorage.setItem('username', username); 
      navigate('/select-genres', { state: { username } });
    }
  };
  

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#121212] to-[#000000] text-white font-sans">
      <div className="text-center p-8 bg-[#1a1a1a] rounded-2xl shadow-lg w-[90%] max-w-md">
        <h1 className="text-4xl font-bold mb-2">Welcome! </h1>
        <p className="text-gray-400 mb-6">Start your journey by giving your username</p>

        <input
          type="text"
          placeholder="e.g. abc@123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-[#2c2c2c] text-white border border-gray-600 focus:outline-none focus:border-green-400"
        />

        <button
          onClick={handleStart}
          className="mt-5 w-full bg-green-500 hover:bg-green-600 transition text-white py-2 rounded-md font-medium"
        >
          Start Exploring
        </button>
        
      </div>
    </div>
  );
}

export default WelcomePage;
