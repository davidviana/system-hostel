import { useState } from "react";
import InputMask from 'react-input-mask';
import "./cadaster.css";

function CadasterPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [document, setDocument] = useState('');
    const [bornDate, setBorndate] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [formErrors, setFormErrors] = useState('');

    const validateName = (e) => {
        const input = e.target;
        const value = input.value;
        const regex = /^[a-zA-Z\s]+$/;

        if (!regex.test(value)) {
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    }

    const validateEmail = (e) => {
        const input = e.target;
        const value = input.value;

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(value)) {
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    }

    const validatePassword = (value) => {
        return value.length >= 8;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !email || !document || !telefone || !senha) {
            setFormErrors('Todos os campos devem ser preenchidos.');
            return;
        }

        if (!validatePassword(senha)) {
            setFormErrors('A senha deve possuir pelo menos 8 caracteres.');
            return;
        }

        setFormErrors('');

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
        <div className="header">
            <div className="header-content">
                <div className="header-text">
                    <h1>Hostel BR</h1>
                    <h1>Bom Retiro</h1>
                    <span id="header-span">
                        <p>Venha conhecer o Hostel BR - Bom Retiro</p>
                        <span>Economia e qualidade no mesmo lugar</span>
                    </span>
                </div>
                <div className="container-register-form">
                    <div className="register-form">
                        <h2>Cadastre-se</h2>
                        <form onSubmit={handleSubmit}>
                            <label>Nome
                                <input
                                    type="text"
                                    placeholder="Digite seu nome"
                                    value={nome}
                                    maxLength={100}
                                    onChange={(e) => setNome(e.target.value)}
                                    onBlur={(e) => validateName(e)}
                                    required
                                />
                            </label>
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

                            <label>E-mail
                                <input
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={(e) => validateEmail(e)}
                                    required
                                />
                            </label>

                            <label>
                                Data de Nascimento:
                                <InputMask
                                    mask="99/99/9999"
                                    placeholder="Digite sua data de nascimento"
                                    value={bornDate}
                                    onChange={(e) => setBorndate(e.target.value)}
                                    required
                                >
                                    {(inputProps) => <input {...inputProps} />}
                                </InputMask>
                            </label>

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
                            <label>Senha
                            <input
                                type="password"
                                placeholder="Digite uma senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                            </label>
                            {formErrors && <p className="error">{formErrors}</p>}
                            <button type="submit">Cadastrar</button>
                        </form>
                        <p>
                            Já possui conta? <a id="text-login" href="/login">Faça Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CadasterPage;
