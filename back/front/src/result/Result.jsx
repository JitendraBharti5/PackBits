import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Singri from '../components/Singri';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Result() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const selectedQuantity = queryParams.get('quantity') || '';

  const [product, setProduct] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showNutrients, setShowNutrients] = useState(false);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://packbits.onrender.com/select/result/${id}?quantity=${selectedQuantity}`);
        const data = res.data;
  
        // If selectedQuantity is empty and available_quantities exists, set default and reload
        if ((!selectedQuantity || selectedQuantity.trim() === '') && data.available_quantities?.length) {
          const defaultQty = data.available_quantities[0];
          navigate(`/result/${id}?quantity=${defaultQty}`, { replace: true });
          return;
        }
  
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id, selectedQuantity, navigate]);
  

  const {
    product_name,
    image_url,
    category,
    veg_non_veg,
    ingredients_per_100ml = {},
    nutrients_per_100ml = {},
    allergy_info = [],
    ingredientColors = [],
    selected_quantity,
  } = product || {};
  const validImageUrl = image_url && image_url.trim() !== "" ? image_url : "/images/fallback.jpg"; 
  let isVeg=false;
  if(veg_non_veg==="veg"){
    isVeg ="true";
  }
  

  const pieLabels = Object.keys(ingredients_per_100ml);
  const pieDataValues = pieLabels.map((ingredient) => {
    const amountStr = ingredients_per_100ml[ingredient];
    const match = amountStr.match(/^([\d.]+)/);
    const baseAmount = match ? parseFloat(match[1]) : 0;
    const quantity = parseFloat(selected_quantity || selectedQuantity || 100);
    return ((baseAmount * quantity) / 100).toFixed(2);
  });

  const pieChartData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieDataValues,
        backgroundColor: ingredientColors.length >= pieLabels.length
          ? ingredientColors
          : pieLabels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16)),
        borderWidth: 1,
      },
    ],
  };

  const handleTestClick = () => {
    navigate(`/test/${id}?quantity=${selected_quantity || selectedQuantity}`);
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: 20,
        },
      },
    },
  };

  if (!product) {
    return (
      <div className="bg-[#121212] min-h-screen flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-center mt-20 text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <Navbar className="bg-[#1c1c1c]" />
      <div className="text-center mt-5 pt-10">
        <h1 className="font-bold text-4xl p-1 inline-block text-white">{product_name.replace(/\d+$/, '')}</h1>
      </div>

      <div className="mx-auto max-w-6xl p-4">
        <div className="bg-[#1e1e1e] rounded-2xl shadow-md flex flex-col md:flex-row items-center p-6 gap-6">
          <img
            src={validImageUrl}
            alt={product_name}
            className="w-60 h-60 object-cover rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
          />

          <div className="flex-1">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-[#2c2c2c] text-sm px-3 py-1 rounded-full">{selected_quantity || selectedQuantity}</span>
              <span className="bg-[#2c2c2c] text-sm px-3 py-1 rounded-full">{category}</span>
              <span className="bg-[#2c2c2c] text-sm px-3 py-1 rounded-full flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                {isVeg ? 'Veg' : 'Non-Veg'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="p-2 text-lg">Ingredient (per {selected_quantity || selectedQuantity})</th>
                    <th className="p-2 text-lg">Amount</th>
                  </tr>
                </thead>
                <tbody>
  {Object.entries(ingredients_per_100ml).map(([ingredient, amountStr], index) => {
const match = amountStr.match(/^([\d.]+)\s*([a-zA-Z]*)$/);
const num = match ? parseFloat(match[1]) : 0;
    const unit = match ? match[2] : '';
    
    let qty = selected_quantity || selectedQuantity || "100";
    qty = qty.toString().trim(); 
   
    if (qty.match(/(L|Kg | kg)$/)) {
        qty = parseFloat(qty) * 1000;
    } else {
        qty = parseFloat(qty);
    }

    const calculatedAmount = ((num * qty) / 100).toFixed(2);
    
    return (
      <tr key={index} className="border-b border-gray-700 hover:bg-[#333] transition duration-300">
        <td
          className="p-2 cursor-pointer text-blue-400 hover:underline"
          onClick={() => setSelectedIngredient({ name: ingredient, amount: `${calculatedAmount} ${unit}` })}
        >
          {ingredient}
        </td>
        <td className="p-2">{calculatedAmount} {unit}</td>
      </tr>
    );
  })}
</tbody>
              </table>
            </div>

            {/* Heading + Show Nutrients Button */}
            <div className="flex justify-between items-center mt-6 mb-2">
              <h2 className="text-xl font-semibold">Allergy Info</h2>
              <button
                onClick={() => setShowNutrients(!showNutrients)}
                className="text-sm bg-[#2c2c2c] px-4 py-1 rounded-full hover:bg-[#3c3c3c] transition"
              >
                {showNutrients ? 'Hide Nutrients' : 'Show Nutrients'}
              </button>
            </div>

            {/* Allergy Info */}
            {allergy_info.length ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {allergy_info.map((item, index) => (
                  <span
                    key={index}
                    className="bg-red-600 text-white text-sm px-3 py-1 rounded-full"
                  >
                    ⚠ {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">No allergy information available.</p>
            )}

            {/* Nutrients Card */}
            {showNutrients && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-40"
      onClick={() => setShowNutrients(false)}
    />

    {/* Nutrients Floating Card */}
    <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] rounded-2xl shadow-lg border border-gray-600 w-[90%] max-w-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Nutrients (per {selected_quantity || selectedQuantity})</h3>
        <button
  onClick={() => setShowNutrients(false)}
  className="text-white text-xl hover:scale-110 transition-transform duration-200"
  aria-label="Close nutrients card"
>
  ×
</button>

      </div>
      <table className="w-full text-left border-collapse text-white">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2">Nutrient</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
  {Object.entries(nutrients_per_100ml).map(([nutrient, amountStr], index) => {
    // Adjusted regex to handle optional spaces
    const match = amountStr.match(/^([\d.]+)\s*([a-zA-Z]*)$/);
    const num = match ? parseFloat(match[1]) : 0;
    const unit = match ? match[2] : '';

    let qty = selected_quantity || selectedQuantity || "100"; 
    qty = qty.toString().trim(); 

    if (qty.match(/(L|Kg | kg)$/)) {
        qty = parseFloat(qty) * 1000;
    } else {
        qty = parseFloat(qty);
    }

    const calculatedAmount = ((num * qty) / 100).toFixed(2);

    return (
      <tr key={index} className="border-b border-gray-700 hover:bg-[#333] transition duration-300">
        <td className="p-2">{nutrient}</td>
        <td className="p-2">{calculatedAmount} {unit}</td>
      </tr>
    );
  })}
</tbody>

      </table>
    </div>
  </>
)}

          </div>

          <div className="flex flex-col items-center">
            <div className="w-52 h-52 mb-6">
              <Pie data={pieChartData} options={pieOptions} />
            </div>

            <button
              onClick={handleTestClick}
              className="mt-4 px-6 py-2 bg-[#03C755] hover:bg-[#00b544] text-white font-semibold rounded-full transition"
            >
              Test For My Profile
            </button>
          </div>
        </div>
      </div>

      <Singri selectedIngredient={selectedIngredient} />
    </div>
  );
}

export default Result;
