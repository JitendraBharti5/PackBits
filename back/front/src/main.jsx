import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthProvider.jsx';
import { HashRouter } from 'react-router-dom';


  

ReactDOM.createRoot(document.getElementById('root')).render(
    <HashRouter>
    <AuthProvider>
        <div>
        <App/>
        </div>
    </AuthProvider>
    </HashRouter>,
);
