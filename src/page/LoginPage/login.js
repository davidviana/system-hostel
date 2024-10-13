// App.js
import { useState } from "react";
import InputMask from 'react-input-mask';

import "./login.css";
import Footer from '../../components/Footer/footer';
import NavBar from "../../components/Navbar/navbar";
// import SliderComponent from "../../components/Carrousel/carrousel";

import CoupleRoom from '../../assets/couple_room.png';
import SharedRoom from '../../assets/shared_room.png';
import Item_1 from '../../assets/carrousel_item_1.png';
import Item_2 from '../../assets/carrousel_item_2.png';
import Item_3 from '../../assets/carrousel_item_3.png';

function LoginPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [document, setDocument] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3001/api/cliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, document, email, telefone, senha }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Formulário enviado com sucesso:', data);
            setNome('');
            setEmail('');
            setDocument('');
            setTelefone('');
            setSenha('');
        } else {
            console.error('Erro ao enviar o formulário');
        }
    };

    return (
        <div className="App">
            <NavBar className="navbar"/>
            <header className="header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>Hostel BR - Bom Retiro</h1>
                    </div>
                    <div className="container-register-form">
                        <div className="register-form">
                            <h2>Login</h2>
                            <form onSubmit={handleSubmit}>
                                <label>E-mail</label>
                                <input
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label>Senha</label>
                                <input
                                    type="password"
                                    placeholder="Digite uma senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                                <button type="submit">Entrar</button>
                            </form>
                            <p>
                                Ainda não possui conta? <a href="/login">Cadastrar-se</a>
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <section className="gallery">
                <h2>Galeria de Fotos</h2>
                <div className="gallery-images">
                    <img src={Item_1} alt="Imagem 1" />
                    <img src={Item_2} alt="Imagem 2" />
                    <img src={Item_3} alt="Imagem 3" />
                </div>
            </section>

            {/* <SliderComponent/> */}

            <section className="banner">
                <h2>Uma super experiência para contar!</h2>
                <button>Reservar Agora</button>
            </section>

            <section className="accommodations">
                <h2>Nossas Acomodações</h2>
                <p>Quartos Individuais ou Compartilhados</p>
                <div className="room">
                    <img src={CoupleRoom} alt="Quarto Individual" />
                    <h3>Quarto Individual</h3>
                    <p><span>R$150</span> / noite</p>
                </div>
                <div className="room">
                    <img src={SharedRoom} alt="Quarto Compartilhado" />
                    <h3>Quarto Compartilhado</h3>
                    <p><span>R$300</span> / noite</p>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default LoginPage;
