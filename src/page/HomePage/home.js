import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/Navbar/navbar";

function HomePage() {
    return(
        <div>
            <NavBar />
            HomePage
            <button><Link to='/update'>Atualizar o cadastro</Link></button>
            <button><Link to='/delete'>Deletar o cadastro</Link></button>
        </div>
    );
}

export default HomePage;