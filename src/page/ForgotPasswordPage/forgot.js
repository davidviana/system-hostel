// ForgotPasswordPage.js
import { useState } from "react";
import './forgot.css';
import { useNavigate } from "react-router-dom";

import LoginPage from "../LoginPage/login";

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(''); 
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate()

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/cliente/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            setStep(2); // Avança para a etapa de confirmação do código
            setSuccessMessage('Código enviado para o e-mail. Verifique sua caixa de entrada.');

        } catch (error) {
            setErrorMessage(error.message);
            console.error('Erro ao enviar o formulário', error);
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/cliente/confirm-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            setStep(3);
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Erro ao confirmar o código', error);
        }
    };

    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/cliente/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            setSuccessMessage('Senha redefinida com sucesso! Você pode fazer login agora.');
            setEmail('');
            setCode('');
            setNewPassword('');
            navigate('/login')

        } catch (error) {
            setErrorMessage(error.message);
            console.error('Erro ao redefinir a senha', error);
        }
    };

    return (
        <div className="login-container-register-form">
            <div className="login-register-form">
                {step === 1 && (
                    <>
                        <h2>Esqueceu sua senha</h2>
                        <p>Para efetuar a troca de senha, informe o e-mail cadastrado</p>
                        <form onSubmit={handleEmailSubmit}>
                            <label>E-mail</label>
                            <input
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit">Confirmar</button>
                            {errorMessage && <p className="login-error-message">{errorMessage}</p>}
                            {successMessage && <p className="login-success-message">{successMessage}</p>}
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2>Confirme o Código</h2>
                        <p>Um código foi enviado para o seu e-mail. Verifique e insira abaixo.</p>
                        <form onSubmit={handleCodeSubmit}>
                            <label>Código</label>
                            <input
                                type="text"
                                placeholder="Digite o código recebido"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                            <button type="submit">Confirmar Código</button>
                            {errorMessage && <p className="login-error-message">{errorMessage}</p>}
                        </form>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2>Redefina sua Senha</h2>
                        <form onSubmit={handleNewPasswordSubmit}>
                            <label>Nova Senha</label>
                            <input
                                type="password"
                                placeholder="Digite sua nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button type="submit">Redefinir Senha</button>
                            {errorMessage && <p className="login-error-message">{errorMessage}</p>}
                            {successMessage && <p className="login-success-message">{successMessage}</p>}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
