import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { motion } from 'framer-motion';

const Ingredient = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const fetchSuggestions = async (search) => {
    try {
      const res = await axios.get(`https://packbits.onrender.com/search?name=${search}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = async (name) => {
    setQuery(name);
    setSuggestions([]);
    try {
      const res = await axios.get(`https://packbits.onrender.com/ingredient/${name}`);
      setSelectedIngredient(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getHarmColor = (level) => {
    switch (level) {
      case 'High':
        return 'text-red-500';
      case 'Moderate':
        return 'text-yellow-400';
      case 'Low':
        return 'text-green-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl pt-3 space-y-4 relative">
          <h2 className="text-2xl font-bold text-center text-white mb-2">Search for an Ingredient</h2>
          <div className="relative">
            <input
              type="text"
              className="w-full px-5 py-3 rounded-2xl bg-[#1E1E1E] border border-[#03C755] text-white focus:outline-none focus:ring-2 focus:ring-[#03C755] placeholder:text-gray-400"
              placeholder="Search for an ingredient"
              value={query}
              onChange={handleChange}
            />
            {suggestions.length > 0 && (
              <ul className="absolute w-full bg-[#1e1e1e] border border-[#03C755] rounded-xl mt-2 shadow-lg z-10 max-h-60 overflow-auto">
                {suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-3 text-white cursor-pointer hover:bg-[#03C755]/20 transition-all border-b border-[#2c2c2c] last:border-none"
                    onClick={() => handleSelect(item.name)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {selectedIngredient && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 w-full max-w-5xl bg-[#1E1E1E] rounded-2xl shadow-2xl p-6 flex flex-col lg:flex-row gap-8"
          >
            {/* Image Placeholder */}
            <div className="w-full lg:w-1/3 h-52 bg-[#2C2C2C] rounded-xl flex items-center justify-center text-gray-400 text-sm">
              Image Not Found
            </div>

            {/* Ingredient Details */}
            <div className="flex-1 space-y-4">
              <h3 className="text-3xl font-bold text-[#03C755] capitalize">{selectedIngredient.name}</h3>

              <div className="flex flex-wrap gap-3">
                <span className="bg-[#2c2c2c] text-sm px-4 py-2 rounded-full">{selectedIngredient.category}</span>
                <span className={`bg-[#2c2c2c] text-sm px-4 py-2 rounded-full ${getHarmColor(selectedIngredient.harmLevel)}`}>
                  Harm Level: {selectedIngredient.harmLevel}
                </span>
              </div>

              <div>
                <h4 className="text-xl text-[#00C9A7] font-semibold mb-1">Max Consumption (g/day)</h4>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  <li>1–10 years: {selectedIngredient.maxConsumption['1-10 years']}g</li>
                  <li>10–16 years: {selectedIngredient.maxConsumption['10-16 years']}g</li>
                  <li>16+ years: {selectedIngredient.maxConsumption['16+ years']}g</li>
                </ul>
              </div>

              {selectedIngredient.restrictedFor.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-[#FF7373]">Restricted For</h4>
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {selectedIngredient.restrictedFor.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              {selectedIngredient.sideEffects.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-[#FFA94D]">Side Effects</h4>
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {selectedIngredient.sideEffects.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Ingredient;
