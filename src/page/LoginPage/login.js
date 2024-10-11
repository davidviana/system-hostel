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
                        <h1>Hotel BR</h1>
                        <h1>Bom Retiro</h1>
                        <span id="header-span">
                            <p>Venha conhecer o Hotel BR - Bom Retiro</p>
                            <span>Economia e qualidade no mesmo lugar</span>
                        </span>
                    </div>
                    <div className="container-register-form">
                        <div className="register-form">
                            <h2>Cadastre-se</h2>
                            <form onSubmit={handleSubmit}>
                                <label>Nome</label>
                                <input
                                    type="text"
                                    placeholder="Digite seu nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                                <label>
                                    CPF:
                                    <InputMask
                                        mask="999.999.999-99"
                                        placeholder="Digite seu CPF"
                                        value={document}
                                        onChange={(e) => setDocument(e.target.value)}
                                        required
                                    >
                                        {(inputProps) => <input {...inputProps} />}
                                    </InputMask>
                                </label>

                                <label>E-mail</label>
                                <input
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label>
                                    Telefone:
                                    <InputMask
                                        mask="(99) 99999-9999"
                                        placeholder='Digite o seu telefone'
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                        required
                                    >
                                        {(inputProps) => <input {...inputProps} />}
                                    </InputMask>
                                </label>
                                <label>Senha</label>
                                <input
                                    type="password"
                                    placeholder="Digite uma senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                                <button type="submit">Cadastrar</button>
                            </form>
                            <p>
                                Já possui conta? <a href="/login">Faça Login</a>
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
