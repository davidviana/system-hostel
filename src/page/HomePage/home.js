import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
    return(
        <div>
            HomePage
            <button><Link to='/update'>Atualizar o cadastro</Link></button>
            <button><Link to='/delete'>Deletar o cadastro</Link></button>
        </div>
    );
}

export default HomePage;