// App.js
import React from "react";
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import "./navbar.css";
import Login from "../../page/LoginPage/login";

function NavBar() {
    return (
            <div className="navbar">
            <div className="navbar-container">
                <a href="/fotos">Fotos</a>
                <a href="/acomodacoes">Acomodações</a>
                <a href="/reservas">Minhas Reservas</a>
            </div>
            <button className="button-login"><a href="/login">Login</a></button>
        </div>
    );
}

export default NavBar;
