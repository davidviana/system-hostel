// Login.js
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import Footer from '../../components/Footer/footer';
import NavBar from "../../components/Navbar/navbar";
import CoupleRoom from '../../assets/couple_room.png';
import SharedRoom from '../../assets/shared_room.png';
import Item_1 from '../../assets/carrousel_item_1.png';
import Item_2 from '../../assets/carrousel_item_2.png';
import Item_3 from '../../assets/carrousel_item_3.png';
import loadingGif from '../../assets/loading.gif';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showGif, setShowGif] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/cliente/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Login bem-sucedido:', data);

            localStorage.setItem('isLogged', 'true');
            localStorage.setItem('loginTime', Date.now());

            setShowGif(true);

            setTimeout(() => {
                navigate('/home');
            }, 3000);

        } catch (error) {
            setErrorMessage(error.message);
            console.error('Erro ao enviar o formulário', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const loginTime = localStorage.getItem('loginTime');
            const currentTime = Date.now();
            const TEN_MINUTES = 10 * 60 * 1000;

            if (loginTime && (currentTime - loginTime) >= TEN_MINUTES) {
                localStorage.removeItem('isLogged');
                localStorage.removeItem('loginTime');
                navigate('/login');
            }
        }, 60000);

        return () => clearInterval(intervalId);
    }, [navigate]);

    return (
        <div className="login-App">
            <NavBar className="login-navbar" />
            <header className="login-header">
                <div className="login-header-content">
                    <div className="login-header-text">
                        <h1>Hostel BR - Bom Retiro</h1>
                    </div>
                    <div className="login-container-register-form">
                        <div className="login-register-form">
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
                                    placeholder="Digite sua senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                                <button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Carregando...' : 'Entrar'}
                                </button>
                                {errorMessage && <p className="login-error-message">{errorMessage}</p>}
                            </form>
                            <p>
                                Esqueceu sua senha? <Link id="text-cadaster" to="/reset">Clique-aqui</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {showGif && (
                <div className="loading-container">
                    <img src={loadingGif} alt="Carregando..." />
                </div>
            )}

            <section className="login-gallery">
                <h2>Galeria de Fotos</h2>
                <div className="login-gallery-images">
                    <img src={Item_1} alt="Imagem 1" />
                    <img src={Item_2} alt="Imagem 2" />
                    <img src={Item_3} alt="Imagem 3" />
                </div>
            </section>

            <section className="login-banner">
                <h2>Uma super experiência para contar!</h2>
                <button>Reservar Agora</button>
            </section>

            <section className="login-accommodations">
                <h2>Nossas Acomodações</h2>
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

export default LoginPage;
