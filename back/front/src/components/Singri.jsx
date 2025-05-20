import React, { useEffect, useState } from 'react';
import meterLow from '../assets/low.png';
import meterMedium from '../assets/medium.png';
import meterHigh from '../assets/high.png';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Singri({ selectedIngredient }) {
  const [ingredientData, setIngredientData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchIngredient = async () => {
      if (!selectedIngredient) return;

      try {
        const res = await axios.get(`https://packbits.onrender.com/ingredient/${selectedIngredient.name}`);
        setIngredientData(res.data);
        setError(false);
      } catch (error) {
        console.error('Error fetching ingredient data:', error);
        if (error.response && error.response.status === 404) {
          toast.error(`Ingredient "${selectedIngredient.name}" not found.`, {
            position: 'top-center',
            autoClose: 3000,
          });
        }
        setError(true);
        setIngredientData(null);
      }
    };

    fetchIngredient();
  }, [selectedIngredient]);

  if (error) {
    return (
      <>
        <ToastContainer />
        <div className="mx-auto mt-16 max-w-3xl px-6" />
      </>
    );
  }

  if (!selectedIngredient || !ingredientData) return null;

  const getMeterImage = (harmLevel) => {
    switch (harmLevel) {
      case 'Low':
        return meterLow;
      case 'Moderate':
        return meterMedium;
      case 'High':
        return meterHigh;
      default:
        return meterLow;
    }
  };

  const getMaxConsumptionForAge = (maxData) => {
    const user = JSON.parse(localStorage.getItem("Users"));
    const age = user.age;
    if (!maxData || isNaN(age)) return 0;

    for (const key in maxData) {
      const cleanKey = key.replace(' years', '');

      if (cleanKey.includes('+')) {
        const min = parseInt(cleanKey.replace('+', ''), 10);
        if (age >= min) return maxData[key];
      } else if (cleanKey.includes('-')) {
        const [min, max] = cleanKey.split('-').map(Number);
        if (age >= min && age <= max) return maxData[key];
      }
    }

    return 0;
  };

  const contains = parseFloat((selectedIngredient.amount || '0').toString().replace(/[^\d.]/g, '')) || 0;
  const maxAllowed = getMaxConsumptionForAge(ingredientData.maxConsumption);

  const barData = {
    labels: ['Safe Level', 'Contains'],
    datasets: [
      {
        label: selectedIngredient.name + " (grams)",
        data: [maxAllowed, contains],
        backgroundColor: ['#03C755', '#FF6B6B'],
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-4">
          <h1 className="font-extrabold text-xl sm:text-3xl text-white tracking-wide">
            Ingredient Details
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row bg-[#1e1e1e] text-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left - Text Info */}
          <div className="flex-1 p-6 sm:p-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#03C755] capitalize">
              {selectedIngredient.name}
            </h2>

            <div className="flex flex-wrap gap-3">
              <span className="bg-[#2c2c2c] text-sm sm:text-base px-4 py-2 rounded-full">{ingredientData.category}</span>
              <span className="bg-[#2c2c2c] text-sm sm:text-base px-4 py-2 rounded-full">{selectedIngredient.amount}</span>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#00C9A7] mb-2">Side Effects</h3>
              {ingredientData.sideEffects?.length ? (
                <ul className="list-disc list-inside text-sm leading-relaxed">
                  {ingredientData.sideEffects.map((effect, index) => (
                    <li key={index}>{effect}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No side effects found.</p>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#FF7373] mb-2">Restricted For</h3>
              {ingredientData.restrictedFor?.length ? (
                <ul className="list-disc list-inside text-sm leading-relaxed">
                  {ingredientData.restrictedFor.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No restrictions listed.</p>
              )}
            </div>
          </div>

          {/* Right - Chart and Harm Level */}
          <div className="bg-[#121212] flex flex-col items-center justify-center lg:w-1/2 px-6 py-10">
            <img
              src={getMeterImage(ingredientData.harmLevel)}
              alt={`${ingredientData.harmLevel} harm level`}
              className="w-48 h-28 object-contain"
            />
            <span className="text-white text-lg font-semibold mt-2 mb-4">
              Harm Level: <span className="capitalize">{ingredientData.harmLevel}</span>
            </span>

            <div className="w-full max-w-sm sm:max-w-md mt-4">
              <Bar data={barData} options={barOptions} />
            </div>
            <p className="text-yellow-800 font-semibold text-center text-sm">Based on your profile</p>
            {contains > maxAllowed && (
              <p className="text-red-500 font-semibold text-center text-sm mt-1">
                ⚠️ {selectedIngredient.name} amount exceeds per day max Consumption limit!
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Singri;
