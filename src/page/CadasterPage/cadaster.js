// App.js
import { useState } from "react";
import InputMask from 'react-input-mask';
import "./cadaster.css";

function CadasterPage() {
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
                                Já possui conta? <a id="text-login" href="/login">Faça Login</a>
                            </p>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default CadasterPage;
