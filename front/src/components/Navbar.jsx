import React, { useEffect } from "react";
import { useState } from "react";
import Login from "./Login";
import Logout from "./Logout";
import { useAuth } from "../context/AuthProvider";
import { Link } from 'react-router-dom';

function Navbar({ className = '' }) {
  const [authUser, setAuthUser] = useAuth();
  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-10 px-6 py-2 flex justify-between items-center text-white ${className}`}>
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li><Link to="/">Home</Link></li>
             <li><Link to="/ingredients">Ingredients</Link></li> 
             <li><Link to="/profile">Profile</Link></li> 
             <li><Link to="/about">About</Link></li> 
            </ul>
          </div>
          <a className="font-bold cursor-pointer text-2xl text-green-400">PackBits</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
             <li><Link to="/">Home</Link></li>
             <li><Link to="/ingredients">Ingredients</Link></li> 
             <li><Link to="/profile">Profile</Link></li> 
             <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <div className="navbar-end">
        {authUser ? (
              <Logout />
            ) : (
              <div className="">
                <a
                  className="bg-black text-white px-3 py-2 rounded-md hover:bg-slate-800 duration-300 cursor-pointer"
                  onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                  }
                >
                  Login
                </a>
                <Login />
              </div>
            )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
