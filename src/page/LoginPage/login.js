import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputMask from 'react-input-mask';
import "./login.css";
import Lottie from 'react-lottie-player';
import FirstloadingAnimation from '../../assets/loading_animation_1.json';
import SecondloadingAnimation from '../../assets/loading_animation_2.json';
import ThirdloadingAnimation from '../../assets/loading_animation_3.json';
import FourtloadingAnimation from '../../assets/loading_animation_4.json';

function LoginPage() {
    const [document, setDocument] = useState('');
    const [senha, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formErrors, setFormErrors] = useState('');
    const [showAnimation, setShowAnimation] = useState(false);
    const [loadingAnimation, setLoadingAnimation] = useState(null);
    const navigate = useNavigate();

    const validateCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, '');

        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
            return false;
        }

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let firstVerifier = 11 - (sum % 11);
        if (firstVerifier === 10 || firstVerifier === 11) {
            firstVerifier = 0;
        }
        if (firstVerifier !== parseInt(cpf.charAt(9))) {
            return false;
        }

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        let secondVerifier = 11 - (sum % 11);
        if (secondVerifier === 10 || secondVerifier === 11) {
            secondVerifier = 0;
        }
        if (secondVerifier !== parseInt(cpf.charAt(10))) {
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/funcionario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ document, senha }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const data = await response.json();

            localStorage.setItem('userId', data.colab.id);
            localStorage.setItem('isLogged', 'true');
            localStorage.setItem('loginTime', Date.now());

            const list_loading = [
                FirstloadingAnimation,
                SecondloadingAnimation,
                ThirdloadingAnimation,
                FourtloadingAnimation
            ];

            const randomIndex = Math.floor(Math.random() * list_loading.length);
            setLoadingAnimation(list_loading[randomIndex]);

            setShowAnimation(true);

            setTimeout(() => {
                navigate('/home');
            }, 3000);

        } catch (error) {
            setErrorMessage(error.message);
            console.error('Erro ao enviar o formulário', error);
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
                window.location.reload()
                navigate('/login');
            }
        }, 60000);

        return () => clearInterval(intervalId);
    }, [navigate]);

    return (
        <div className="login-App">
            <header className="login-header">
                <div className="login-header-content">
                    <div className="login-header-text">
                        <h1>IYEEHCEL - Hotel</h1>
                    </div>
                    <div className="login-container-register-form">
                        <div className="login-register-form">
                            <h2>Login</h2>
                            <form onSubmit={handleSubmit}>
                                <label>
                                    CPF
                                    <InputMask
                                        mask="999.999.999-99"
                                        placeholder="Digite seu CPF"
                                        value={document}
                                        onChange={(e) => setDocument(e.target.value)}
                                        onBlur={() => !validateCPF(document) && setFormErrors('CPF inválido.')}
                                        required
                                    >
                                        {(inputProps) => <input {...inputProps} />}
                                    </InputMask>
                                </label>
                                <label>Senha</label>
                                <input
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                                <button type="submit">Entrar</button>
                                {errorMessage && <p className="login-error-message">{errorMessage}</p>}
                            </form>
                            <p>
                                Esqueceu sua senha? <Link id="text-cadaster" to="/reset">Clique-aqui</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {showAnimation && loadingAnimation && (
                <div className="loading-container">
                    <Lottie
                        id='gif'
                        loop
                        animationData={loadingAnimation}
                        play
                        style={{ width: 600, height: 600 }}
                    />
                </div>
            )}
            
        </div>
    );
}

export default LoginPage;
