import { useState } from "react";
import InputMask from 'react-input-mask';
import "./cadaster.css";

function CadasterPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [document, setDocument] = useState('');
    const [bornDate, setBorndate] = useState('');
    const [telefone, setTelefone] = useState('');
    const [sexo, setSexo] = useState('');
    const [senha, setSenha] = useState('');
    const [formErrors, setFormErrors] = useState('');

    // Função para validar CPF
    const validateCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres especiais

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

    // Validação de Nome
    const validateName = (name) => {
        const regex = /^[a-zA-Z\s]+$/;
        return regex.test(name);
    }

    // Validação de Email
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Validação de Senha
    const validatePassword = (password) => {
        return password.length >= 8;
    }

    // Validação de Idade
    const validateAge = (date) => {
        const [day, month, year] = date.split('/');
        const formatedDate = new Date(`${year}-${month}-${day}`);

        if (isNaN(formatedDate)) {
            return false;
        }

        let today = new Date();
        let age = today.getFullYear() - formatedDate.getFullYear();
        const monthDiff = today.getMonth() - formatedDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < formatedDate.getDate())) {
            age--;
        }

        return age >= 18;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(nome, document, email, bornDate, telefone, sexo, senha)

        if (!nome || !email || !document || !bornDate || !telefone || !senha || !sexo) {
            setFormErrors('Todos os campos devem ser preenchidos.');
            return;
        }

        if (!validatePassword(senha)) {
            setFormErrors('A senha deve possuir pelo menos 8 caracteres.');
            return;
        }

        if (!validateEmail(email)) {
            setFormErrors('O e-mail informado não é válido.');
            return;
        }

        if (!validateName(nome)) {
            setFormErrors('O nome informado não é válido.');
            return;
        }

        if (!validateAge(bornDate)) {
            setFormErrors('O usuário é menor de idade.');
            return;
        }

        if (!validateCPF(document)) {
            setFormErrors('O CPF informado não é válido.');
            return;
        }

        setFormErrors('');

        const response = await fetch('http://localhost:3001/api/cliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, document, email, bornDate, telefone, sexo, senha }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Formulário enviado com sucesso:', data);
            setNome('');
            setEmail('');
            setDocument('');
            setBorndate('');
            setTelefone('');
            setSexo('');
            setSenha('');
        } else {
            console.error('Erro ao enviar o formulário');
            setFormErrors('Erro ao enviar o formulário');
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
                                    onBlur={() => !validateName(nome) && setFormErrors('Nome inválido.')}
                                    required
                                />
                            </label>
                            <div className="stacked-textfield">
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

                                <label>E-mail
                                    <input
                                        type="email"
                                        placeholder="Digite seu e-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={() => !validateEmail(email) && setFormErrors('E-mail inválido.')}
                                        required
                                    />
                                </label>
                            </div>

                            <label>
                                Data de Nascimento
                                <InputMask
                                    mask="99/99/9999"
                                    placeholder="Digite sua data de nascimento"
                                    value={bornDate}
                                    onChange={(e) => setBorndate(e.target.value)}
                                    onBlur={() => !validateAge(bornDate) && setFormErrors('Data de nascimento inválida ou menor de idade.')}
                                    required
                                >
                                    {(inputProps) => <input {...inputProps} />}
                                </InputMask>
                            </label>

                            <div className="stacked-textfield">
                                <label>
                                    Telefone
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

                                <label id="drop-list">
                                    Sexo
                                    <select
                                        value={sexo}
                                        onChange={(e) => setSexo(e.target.value)}
                                        required>
                                        <option value="">Selecione</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="feminino">Feminino</option>
                                        <option value="prefiro-não-dizer">Prefiro não dizer</option>
                                    </select>
                                </label>
                            </div>
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
