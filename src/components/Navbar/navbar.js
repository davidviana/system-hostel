// App.js
import React from "react";
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./navbar.css";
import Login from "../../page/LoginPage/login";

function NavBar() {
    return (
        <div className="navbar">
            <div className="navbar-container">
                <a>Fotos</a>
                <a>Acomodações</a>
                <a>Minhas Reservas</a>
            </div>
            <button className="button-login"><a href="">Login</a></button>
        </div>
    );
}

export default NavBar;
