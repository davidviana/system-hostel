// App.js
import { Routes, Route } from 'react-router-dom';
import LoginPage from './page/LoginPage/login';
import CadastroPage from './page/CadasterPage/cadaster';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadaster" element={<CadastroPage />} />
        </Routes>
    );
}

export default App;
