import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './page/LoginPage/login';
import CadastroPage from './page/CadasterPage/cadaster';
import HomePage from './page/HomePage/home';
import ForgotPasswordPage from './page/ForgotPasswordPage/forgot';
import UpdateCadasterPage from './page/UpdateCadasterPage/update_cadaster';
import DeletePage from './page/DeletePage/delete';
import ReservePage from './page/ReservePage/reserve';

import { useEffect, useState } from 'react';

function App() {
    const [isLogged, setIsLogged] = useState(false);
    const navegate = useNavigate()

    useEffect(() => {
        const loginTime = localStorage.getItem('loginTime');
        const currentTime = Date.now();
        const TEN_MINUTES = 10 * 60 * 1000;

        if (loginTime && (currentTime - loginTime) < TEN_MINUTES) {
            setIsLogged(true);
        } else {
            localStorage.removeItem('isLogged');
            localStorage.removeItem('loginTime');
            navegate('/')
        }
    }, []);

    return (
        <Routes>
            {isLogged ? (
                <>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/update" element={<UpdateCadasterPage />} />
                    <Route path="/delete" element={<DeletePage />} />
                    <Route path="/reserve" element={<ReservePage />} />
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
