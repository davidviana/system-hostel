import React from "react";
// import { Link } from "react-router-dom";
import NavBar from "../../components/Navbar/navbar";
import Footer from "../../components/Footer/footer";
import ReserveComponent from "../../components/ReserveComponent/comp_reserve";

import Item_1 from '../../assets/carrousel_item_1.png';
import Item_2 from '../../assets/carrousel_item_2.png';
import Item_3 from '../../assets/carrousel_item_3.png';
import SharedRoom from '../../assets/shared_room.png';
import CoupleRoom from '../../assets/couple_room.png';

import './home.css'

function HomePage() {
    return (
        <div className="login-App">
            <NavBar fotos='galery-section' acomodacoes='acommodation-section' reservas='/reserve' />
            <header className="login-header">
                <div className="login-header-content">
                    <div className="login-header-text" id='teste'>
                        <h1>Hostel BR - Bom Retiro</h1>
                    </div>
                    <ReserveComponent id='reserve-comp'/>
                </div>
            </header>


            <section className="login-gallery" id='galery-section'>
                <h2>Galeria de Fotos</h2>
                <div className="login-gallery-images">
                    <img src={Item_1} alt="Imagem 1" />
                    <img src={Item_2} alt="Imagem 2" />
                    <img src={Item_3} alt="Imagem 3" />
                </div>
            </section>

            <section className="login-banner" id='reservas-section'>
                <h2>Uma super experiência para contar!</h2>
                <button>Reservar Agora</button>
            </section>

            <section className="login-accommodations" id='accomodations-section'>
                <h2 id='acommodation-section'>Nossas Acomodações</h2>
                <p>Quartos Individuais ou Compartilhados</p>
                <div className="login-room">
                    <img src={CoupleRoom} alt="Quarto Individual" />
                    <h3>Quarto Individual</h3>
                    <p><span>R$150</span> / noite</p>
                </div>
                <div className="login-room">
                    <img src={SharedRoom} alt="Quarto Compartilhado" />
                    <h3>Quarto Compartilhado</h3>
                    <p><span>R$300</span> / noite</p>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default HomePage;