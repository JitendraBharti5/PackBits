import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Login from "./Login.jsx";
import { useForm } from "react-hook-form";
import axios from "../utils/axios.jsx";
import toast from "react-hot-toast";

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      age: data.age,
      vegNonVeg: data.vegNonVeg,
    };

    await axios
      .post("/user/signup", userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Signup Successfully");
          navigate(from, { replace: true });
        }
        localStorage.setItem("Users", JSON.stringify(res.data.user));
      })
      .catch((err) => {
        if (err.response) {
          console.log(err);
          toast.error("Error: " + err.response.data.message);
        }
      });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-800">
      <div className="modal-box2 relative bg-gray-900 p-4 rounded-md shadow-lg text-white w-[400px] md:w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Close Button */}
          <Link
            to="/"
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-white"
          >
            ✕
          </Link>

          {/* Header */}
          <h3 className="font-bold text-2xl text-center">Signup</h3>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              {...register("fullname", { required: true })}
            />
            {errors.fullname && (
              <span className="text-xs text-red-500">This field is required</span>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-xs text-red-500">This field is required</span>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Create Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-xs text-red-500">This field is required</span>
            )}
          </div>

          {/* Age & Diet Preference Side-by-Side */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            {/* Age */}
            <div>
              <label className="block text-sm mb-1">Age</label>
              <input
                type="number"
                placeholder="Age"
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 1, message: "Min age is 1" },
                  max: { value: 120, message: "Max age is 120" },
                })}
              />
              {errors.age && (
                <span className="text-xs text-red-500">{errors.age.message}</span>
              )}
            </div>

            {/* Diet Preference */}
            <div>
              <label className="block text-sm mb-1">Diet Preference</label>
              <select
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                {...register("vegNonVeg", {
                  required: "Please select your diet preference",
                })}
              >
                <option value="">Select...</option>
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
              </select>
              {errors.vegNonVeg && (
                <span className="text-xs text-red-500">{errors.vegNonVeg.message}</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition duration-200"
          >
            Signup
          </button>

          {/* Login Prompt */}
          <p className="text-sm text-white mt-4 text-center">
            Already have an account?{" "}
            <Link to="/" className="text-blue-400 underline">
              <button
                type="button"
                className="underline"
                onClick={() => document.getElementById("my_modal_3").showModal()}
              >
                Login
              </button>
              <Login />
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
