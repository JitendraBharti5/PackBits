import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Test = () => {
  const { id } = useParams();
  const location = useLocation();
  const quantity = new URLSearchParams(location.search).get('quantity') || '100';
  const user = JSON.parse(localStorage.getItem("Users"));
  const userId = user?._id;
  const [result, setResult] = useState(null);
   
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await axios.get(`https://packbits.onrender.com/test/${id}?quantity=${quantity}&userId=${userId}`); 
        setResult(res.data);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchMatch();
  }, [id, quantity]);

  if (!result) return <div className="text-white p-10">Loading test results...</div>;

  const { matched_allergies, matched_preconditions, veg_match } = result;
  

  return (
    <div >
      <Navbar />
      <div className="max-w-2xl mx-auto mt-14 bg-[#1e1e1e] p-3 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Test Result</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Allergy Matches</h2>
          {matched_allergies.length ? matched_allergies.map((a, i) => (
            <p key={i} className="text-red-400">⚠ {a}</p>
          )) : <p className="text-gray-400">No matching allergies.</p>}
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Precondition Conflicts</h2>
          {matched_preconditions.length ? matched_preconditions.map((p, i) => (
            <p key={i} className="text-yellow-400">⚠ {p}</p>
          )) : <p className="text-gray-400">No conflicts.</p>}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Diet Match</h2>
          <p className={veg_match ? 'text-green-400' : 'text-red-500'}>
            {veg_match ? '✔️ Matches your dietary preference' : '❌ Does not match your dietary preference'}
          </p>
        </section>
        <section className="mt-8 p-4 border-t border-gray-700">
  <h2 className="text-2xl font-bold mb-3 text-center text-white">📝 Conclusion</h2>
  <div className="bg-[#2a2a2a] rounded-lg p-4 shadow-inner">
    {matched_allergies.length === 0 && matched_preconditions.length === 0 && veg_match ? (
      <p className="text-green-400 font-medium">
        ✅ This product is safe for you. No allergy or precondition conflicts were found, and it matches your dietary preference.
      </p>
    ) : (
      <>
        <p className="text-white font-medium mb-2">⚠ Based on your profile:</p>
        {matched_allergies.length > 0 && (
          <p className="text-red-400 mb-1">
            - Avoid this product due to allergy risks: {matched_allergies.join(', ')}.
          </p>
        )}
        {matched_preconditions.length > 0 && (
          <p className="text-yellow-400 mb-1">
            - Be cautious due to conflicts with your preconditions: {matched_preconditions.join(', ')}.
          </p>
        )}
        {!veg_match && (
          <p className="text-red-500 mb-1">
            - This product does not match your dietary preference.
          </p>
        )}
        <p className="text-gray-300 mt-2">❗ We recommend consulting a healthcare provider before consuming this product.</p>
      </>
    )}
  </div>
</section>

      </div>
    </div>
  );
};

export default Test;
