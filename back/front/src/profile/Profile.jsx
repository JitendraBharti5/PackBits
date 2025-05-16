import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import photo from '../assets/packbits.png';
import { FiEdit2 } from 'react-icons/fi';

function Profile() {
  const user = JSON.parse(localStorage.getItem("Users"));
  const userId = user?._id;

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [vegNonVeg, setVegNonVeg] = useState("");

  const [editName, setEditName] = useState(false);
  const [editAge, setEditAge] = useState(false);
  const [editDiet, setEditDiet] = useState(false);

  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newDiet, setNewDiet] = useState("");

  const [editAllergies, setEditAllergies] = useState(false);
  const [editPreconditions, setEditPreconditions] = useState(false);

  const [allergies, setAllergies] = useState([]);
  const [preconditions, setPreconditions] = useState([]);

  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [selectedPreconditions, setSelectedPreconditions] = useState([]);

  const [allergyOptions, setAllergyOptions] = useState([]);
  const [preconditionOptions, setPreconditionOptions] = useState([]);

  const [allergySearch, setAllergySearch] = useState("");
  const [preconditionSearch, setPreconditionSearch] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`https://packbits.onrender.com/user/${userId}`);
        const { fullname, email, allergies, preconditions, age, vegNonVeg } = res.data.user;
        setFullname(fullname);
        setEmail(email);
        setAge(age);
        setVegNonVeg(vegNonVeg);
        setAllergies(allergies || []);
        setPreconditions(preconditions || []);
        setSelectedAllergies(allergies || []);
        setSelectedPreconditions(preconditions || []);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get('https://packbits.onrender.com/options');
        setAllergyOptions(res.data.allergy || []);
        setPreconditionOptions(res.data.precondition || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleCheckboxChange = (e, type) => {
    const value = e.target.value;
    const checked = e.target.checked;

    if (type === "allergy") {
      setSelectedAllergies(prev =>
        checked ? [...prev, value] : prev.filter(item => item !== value)
      );
    } else {
      setSelectedPreconditions(prev =>
        checked ? [...prev, value] : prev.filter(item => item !== value)
      );
    }
  };

  const saveField = async (updates, closeEditors) => {
    try {
      await axios.put("https://packbits.onrender.com/user/update", {
        userId,
        ...updates,
      });
      closeEditors();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-20 space-y-3">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img src={photo} alt="profile" />
          </div>
        </div>
        <div className="text-lg font-semibold flex flex-wrap justify-center items-center gap-2">
          {/* Fullname */}
          <span className="flex items-center gap-1">
            {editName ? (
              <>
                <input
                  className="border px-1 rounded text-sm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button
                  onClick={() =>
                    saveField({ fullname: newName }, () => {
                      setFullname(newName);
                      setEditName(false);
                    })
                  }
                  className="text-green-600 text-xs font-semibold ml-1"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {fullname}
                <FiEdit2
                  size={12}
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    setNewName(fullname);
                    setEditName(true);
                  }}
                />
              </>
            )}
          </span>

          <span className="text-gray-400">|</span>

          {/* Email (not editable) */}
          <span>{email}</span>

          <span className="text-gray-400">|</span>

          {/* Age */}
          <span className="flex items-center gap-1">
            Age:
            {editAge ? (
              <>
                <input
                  type="number"
                  className="border px-1 w-16 rounded text-sm"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                />
                <button
                  onClick={() =>
                    saveField({ age: newAge }, () => {
                      setAge(newAge);
                      setEditAge(false);
                    })
                  }
                  className="text-green-600 text-xs font-semibold ml-1"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span>{age}</span>
                <FiEdit2
                  size={12}
                  className="text-blue-500 cursor-pointer ml-1"
                  onClick={() => {
                    setNewAge(age);
                    setEditAge(true);
                  }}
                />
              </>
            )}
          </span>

          <span className="text-gray-400">|</span>

          {/* Veg/Non-Veg */}
          <span className="flex items-center gap-1">
            {editDiet ? (
              <>
                <select
                  className="border px-2 py-1 text-sm rounded"
                  value={newDiet}
                  onChange={(e) => setNewDiet(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
                <button
                  onClick={() =>
                    saveField({ vegNonVeg: newDiet }, () => {
                      setVegNonVeg(newDiet);
                      setEditDiet(false);
                    })
                  }
                  className="text-green-600 text-xs font-semibold ml-1"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {vegNonVeg === "veg" ? (
                  <span className="text-green-600">🥦 Veg</span>
                ) : (
                  <span className="text-red-600">🍗 Non-Veg</span>
                )}
                <FiEdit2
                  size={12}
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    setNewDiet(vegNonVeg);
                    setEditDiet(true);
                  }}
                />
              </>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-3 font-medium">
          <span>ID: {userId}</span>
        </div>
      </div>

      {/* Allergies Section */}
      <div className="max-w-xl mx-auto mt-8">
        <h2 className="text-lg font-bold mb-2">Allergies</h2>
        {editAllergies ? (
          <>
            <input
              type="text"
              placeholder="Search allergies"
              className="border px-2 py-1 mb-2 w-full rounded"
              value={allergySearch}
              onChange={(e) => setAllergySearch(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {allergyOptions
                .filter(opt => opt.toLowerCase().includes(allergySearch.toLowerCase()))
                .map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={selectedAllergies.includes(opt)}
                      onChange={(e) => handleCheckboxChange(e, "allergy")}
                    />
                    {opt}
                  </label>
                ))}
            </div>
            <button
              onClick={() =>
                saveField({ allergies: selectedAllergies }, () => {
                  setAllergies(selectedAllergies);
                  setEditAllergies(false);
                })
              }
              className="mt-2 px-4 py-1 bg-green-500 text-white rounded"
            >
              Save Allergies
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {allergies.map((a, idx) => (
              <span key={idx} className="bg-gray-800 px-2 py-1 rounded">{a}</span>
            ))}
            <FiEdit2
              size={15}
              className="text-blue-500 cursor-pointer"
              onClick={() => setEditAllergies(true)}
            />
          </div>
        )}
      </div>

      {/* Preconditions Section */}
      <div className="max-w-xl mx-auto mt-6 mb-10">
        <h2 className="text-lg font-bold mb-2">Preconditions</h2>
        {editPreconditions ? (
          <>
            <input
              type="text"
              placeholder="Search preconditions"
              className="border px-2 py-1 mb-2 w-full rounded"
              value={preconditionSearch}
              onChange={(e) => setPreconditionSearch(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {preconditionOptions
                .filter(opt => opt.toLowerCase().includes(preconditionSearch.toLowerCase()))
                .map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={selectedPreconditions.includes(opt)}
                      onChange={(e) => handleCheckboxChange(e, "precondition")}
                    />
                    {opt}
                  </label>
                ))}
            </div>
            <button
              onClick={() =>
                saveField({ preconditions: selectedPreconditions }, () => {
                  setPreconditions(selectedPreconditions);
                  setEditPreconditions(false);
                })
              }
              className="mt-2 px-4 py-1 bg-green-500 text-white rounded"
            >
              Save Preconditions
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {preconditions.map((p, idx) => (
              <span key={idx} className="bg-gray-800 px-2 py-1 rounded">{p}</span>
            ))}
            <FiEdit2
              size={15}
              className="text-blue-500 cursor-pointer"
              onClick={() => setEditPreconditions(true)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
