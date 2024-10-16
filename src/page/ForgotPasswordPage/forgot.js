import React from "react";
import './forgot.css'

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

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

    return (
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
                    <button type="submit" disabled={isLoading}>
                        Confirmar
                    </button>
                    {errorMessage && <p className="login-error-message">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;