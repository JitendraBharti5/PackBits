// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import homeImg from '../assets/img_home.png';
// import QrScanner from '../components/QrScanner';
// import Navbar from '../components/Navbar';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useAuth } from '../context/AuthProvider';
// import Login from '../components/Login';

// const Home = () => {
//   const [authUser] = useAuth(); 
//   const [query, setQuery] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [quantities, setQuantities] = useState([]);
//   const [selectedQuantity, setSelectedQuantity] = useState('');
//   const [showScanner, setShowScanner] = useState(false);
//   const [scannerKey, setScannerKey] = useState(0);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (query.trim() === '') {
//         setSuggestions([]);
//         return;
//       }
//       try {
//         const res = await axios.get(`https://packbits.onrender.com/select/suggestions?query=${query}`);
//         setSuggestions(res.data);
//       } catch (err) {
//         toast.error('Error fetching product suggestions.');
//         console.error('Error fetching suggestions:', err);
//       }
//     };
//     fetchSuggestions();
//   }, [query]);

//   useEffect(() => {
//     const fetchQuantities = async () => {
//       if (!selectedProduct) return;
//       try {
//         const res = await axios.get(`https://packbits.onrender.com/select/quantities?name=${selectedProduct.product_name}`);
//         setQuantities(res.data);
//         setSelectedQuantity(res.data[0] || '');
//       } catch (err) {
//         toast.error('Error fetching quantities for selected product.');
//         console.error('Error fetching quantities:', err);
//       }
//     };
//     fetchQuantities();
//   }, [selectedProduct]);

//   const handleSuggestionClick = (suggestion) => {
//     setQuery(suggestion.product_name);
//     setSelectedProduct(suggestion);
//     setSuggestions([]);
//   };

//   const handleSearch = () => {
//     if (selectedProduct && selectedQuantity) {
//       navigate(`/result/${selectedProduct._id}?quantity=${selectedQuantity}`);
//     } else {
//       toast.warning('Please select a product and quantity to search.');
//     }
//   };

//   const handleScanSuccess = async (barcode) => {
//     try {
//       console.log("Scanning barcode:", barcode);
//       const res = await axios.get(`https://packbits.onrender.com/select/barcode/${barcode}`);
//       if (res.data && res.data._id) {
//         navigate(`/result/${res.data._id}`);
//       } else {
//         toast.error('Product not found for scanned QR code.');
//       }
//     } catch (err) {
//       toast.error('Product not found for scanned QR code.');
//       console.error('Error handling QR barcode:', err);
//     } finally {
//       setShowScanner(false);
//       setScannerKey(prev => prev + 1);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('image', file);

//     try {
//       const response = await axios.post('https://packbits.onrender.com/select/scan-image', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       console.log("Scan result:", response.data);

//       if (response.data && response.data._id) {
//         handleScanSuccess(response.data._id);
//       } else if (response.data && typeof response.data.barcode === 'string') {
//         handleScanSuccess(response.data.barcode);
//       } else {
//         toast.error("Product not found with this barcode");
//       }

//     } catch (error) {
//       toast.error('Please Upload Valid QR code.');
//       console.error("Image upload error:", error.response?.data || error.message);
//     }
//   };

//   if (!authUser) {
//     return (
//       <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${homeImg})` }}>
//         <Navbar />
//         <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg">
//           <h2 className="text-white text-2xl font-bold text-center mb-4">Please Login/Signup to Continue</h2>
//           <p className="text-amber-400 text-l font-bold text-center">Your profile will be used to check product compatibility with you</p>
//           <Login />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${homeImg})` }}>
//       <Navbar />
//       <div className="flex justify-center items-center pt-20 px-4">
//         <div className="bg-gray-700 bg-opacity-90 mt-10 rounded-xl shadow-lg max-w-xl w-full p-6">
//           <h2 className="text-2xl font-semibold mb-4 text-center text-white">Search Product</h2>

//           <div className="mb-4">
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => {
//                 setQuery(e.target.value);
//                 setSelectedProduct(null);
//               }}
//               placeholder="Search product..."
//               className="w-full p-3 border border-gray-400 rounded-lg shadow-sm"
//             />
//             {suggestions.length > 0 && (
//               <ul className="border rounded mt-1 bg-gray-900 shadow-md max-h-40 overflow-y-auto">
//                 {suggestions.map((s) => (
//                   <li
//                     key={s._id}
//                     onClick={() => handleSuggestionClick(s)}
//                     className="p-2 hover:bg-gray-500 cursor-pointer"
//                   >
//                     {s.product_name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {quantities.length > 0 && (
//             <div className="mb-4">
//               <label className="block mb-1 font-medium text-white">Select Quantity:</label>
//               <select
//                 value={selectedQuantity}
//                 onChange={(e) => setSelectedQuantity(e.target.value)}
//                 className="w-full p-2 border rounded"
//               >
//                 {quantities.map((q, idx) => (
//                   <option key={idx} value={q}>{q}</option>
//                 ))}
//               </select>
//             </div>
//           )}

//           <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
//             <button
//               onClick={handleSearch}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               disabled={!selectedProduct || !selectedQuantity}
//             >
//               Search
//             </button>
//             <button
//               onClick={() => setShowScanner(true)}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Scan Product Barcode
//             </button>
//             <label className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer flex justify-center items-center">
//               Upload Product Barcode
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="hidden"
//               />
//             </label>
//           </div>

//           {showScanner && (
//             <div className="mt-6">
//               <QrScanner
//                 key={scannerKey}
//                 onScanSuccess={handleScanSuccess}
//                 onCancel={() => {
//                   setShowScanner(false);
//                   setScannerKey(prev => prev + 1);
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import homeImg from '../assets/img_home.png';
import QrScanner from '../components/QrScanner';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthProvider';
import Login from '../components/Login';

const Home = () => {
  const [authUser] = useAuth(); 
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:4001/select/suggestions?query=${query}`);
        setSuggestions(res.data);
      } catch (err) {
        toast.error('Error fetching product suggestions.');
        console.error('Error fetching suggestions:', err);
      }
    };
    fetchSuggestions();
  }, [query]);

  useEffect(() => {
    const fetchQuantities = async () => {
      if (!selectedProduct) return;
      try {
        const res = await axios.get(`http://localhost:4001/select/quantities?name=${selectedProduct.product_name}`);
        setQuantities(res.data);
        setSelectedQuantity(res.data[0] || '');
      } catch (err) {
        toast.error('Error fetching quantities for selected product.');
        console.error('Error fetching quantities:', err);
      }
    };
    fetchQuantities();
  }, [selectedProduct]);

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.product_name);
    setSelectedProduct(suggestion);
    setSuggestions([]);
  };

  const handleSearch = () => {
    if (selectedProduct && selectedQuantity) {
      navigate(`/result/${selectedProduct._id}?quantity=${selectedQuantity}`);
    } else {
      toast.warning('Please select a product and quantity to search.');
    }
  };

  const handleScanSuccess = async (barcode) => {
    setLoading(true);
    try {
      console.log("Scanning barcode:", barcode);
      const res = await axios.get(`http://localhost:4001/select/barcode/${barcode}`);
      if (res.data && res.data._id) {
        navigate(`/result/${res.data._id}`);
      } else {
        toast.error('Product not found for scanned QR code.');
      }
    } catch (err) {
      toast.error('Product not found for scanned QR code.');
      console.error('Error handling QR barcode:', err);
    } finally {
      setLoading(false);
      setShowScanner(false);
      setScannerKey(prev => prev + 1);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4001/select/scan-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("Scan result:", response.data);

      if (response.data && response.data._id) {
        handleScanSuccess(response.data._id);
      } else if (response.data && typeof response.data.barcode === 'string') {
        handleScanSuccess(response.data.barcode);
      } else {
        toast.error("Product not found with this barcode");
      }

    } catch (error) {
      toast.error('Please Upload Valid QR code.');
      console.error("Image upload error:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${homeImg})` }}>
        <Navbar />
        <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg">
          <h2 className="text-white text-2xl font-bold text-center mb-4">Please Login/Signup to Continue</h2>
          <p className="text-amber-400 text-l font-bold text-center">Your profile will be used to check product compatibility with you</p>
          <Login />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${homeImg})` }}>
      <Navbar />
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      )}
      <div className="flex justify-center items-center pt-20 px-4">
        <div className="bg-gray-700 bg-opacity-90 mt-10 rounded-xl shadow-lg max-w-xl w-full p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-white">Search Product</h2>

          <div className="mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedProduct(null);
              }}
              placeholder="Search product..."
              className="w-full p-3 border border-gray-400 rounded-lg shadow-sm"
            />
            {suggestions.length > 0 && (
              <ul className="border rounded mt-1 bg-gray-900 shadow-md max-h-40 overflow-y-auto">
                {suggestions.map((s) => (
                  <li
                    key={s._id}
                    onClick={() => handleSuggestionClick(s)}
                    className="p-2 hover:bg-gray-500 cursor-pointer"
                  >
                    {s.product_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {quantities.length > 0 && (
            <div className="mb-4">
              <label className="block mb-1 font-medium text-white">Select Quantity:</label>
              <select
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {quantities.map((q, idx) => (
                  <option key={idx} value={q}>{q}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={!selectedProduct || !selectedQuantity}
            >
              Search
            </button>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Scan Product Barcode
            </button>
            <label className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer flex justify-center items-center">
              Upload Product Barcode
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {showScanner && (
            <div className="mt-6">
              <QrScanner
                key={scannerKey}
                onScanSuccess={handleScanSuccess}
                onCancel={() => {
                  setShowScanner(false);
                  setScannerKey(prev => prev + 1);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
