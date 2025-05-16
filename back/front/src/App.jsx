import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Result from "./result/Result";
import Profile from "./profile/Profile";
import Signup from "./components/Signup";
import { useAuth } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from 'react-toastify';  // Import ToastContainer
import Ingredient from "./ingredients/Ingredients";
import About from "./about/About"
import Test from "./test/Test";
function App() {
   const [authUser, setAuthUser] = useAuth();
  return (
    <>
          <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
  <Routes>
          <Route path="/profile"  element={authUser ? <Profile/> : <Navigate to="/signup" />}/>
          <Route path="/" element={<Home/>}  /> 
          <Route path="/signup" element={<Signup/>} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/ingredients" element={<Ingredient/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/test/:id" element={<Test/>} />
          
  </Routes>
  <Toaster/>
   </>
  );
}
export default App;