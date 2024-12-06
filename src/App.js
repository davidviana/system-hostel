import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './page/LoginPage/login';
import CadastroPage from './page/CadasterPage/cadaster';
import HomePage from './page/HomePage/home';
import ForgotPasswordPage from './page/ForgotPasswordPage/forgot';
import UpdateCadasterPage from './page/UpdateCadasterPage/update_cadaster';
import DeletePage from './page/DeletePage/delete';
import ReservePage from './page/ReservePage/reserve';
import ReserveUsersPage from './page/ReservesUsersPage/reserve_users';

import { useEffect, useState } from 'react';

function App() {
    const [isLogged, setIsLogged] = useState(false);
    const navigate = useNavigate();

    const checkApiStatus = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/shutdown/running');
            if (response.status === 200) {
                console.log('API is running');
                return true;
            } else {
                throw new Error('API not running');
            }
        } catch (error) {
            console.error('API check failed:', error);
            localStorage.clear(); // Limpa o localStorage
            navigate('/'); // Redireciona para a tela de login
            return false;
        }
    };

    useEffect(() => {
        const validateSession = async () => {
            const loginTime = localStorage.getItem('loginTime');
            const currentTime = Date.now();
            const TEN_MINUTES = 10 * 60 * 1000;

            if (loginTime && currentTime - loginTime < TEN_MINUTES) {
                const isApiRunning = await checkApiStatus(); // Verifica a API
                if (isApiRunning) {
                    setIsLogged(true);
                } else {
                    setIsLogged(false);
                    localStorage.clear();
                    navigate('/');
                }
            } else {
                localStorage.clear();
                navigate('/');
            }
        };

        validateSession();
    }, [navigate]);

    return (
        <Routes>
            {isLogged ? (
                <>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/update" element={<UpdateCadasterPage />} />
                    <Route path="/delete" element={<DeletePage />} />
                    <Route path="/reserve" element={<ReservePage />} />
                    <Route path="/my_reserves" element={<ReserveUsersPage />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/cadaster" element={<CadastroPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/reset" element={<ForgotPasswordPage />} />
                </>
            )}
        </Routes>
    );
}

export default App;
