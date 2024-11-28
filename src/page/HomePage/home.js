import React from "react";
import NavBar from "../../components/Navbar/navbar";
import Footer from "../../components/Footer/footer";

import './home.css'
import { useNavigate } from "react-router-dom";

function HomePage() {
    return (
        <div className="login-App">
            <NavBar funcionarios='galery-section' quartos='acommodation-section' reservas='/reserve' />
            <header className="login-header">
                <div className="login-header-content">
                    <div className="login-header-text" id='teste'>
                        <h1>IYEEHCEL - Hotel</h1>
                    </div>
                </div>
            </header>
            <Footer />
        </div>
    );
}

export default HomePage;