import { useState, React } from "react";
import InputMask from 'react-input-mask';
import { useNavigate } from "react-router-dom";
import './update_cadaster.css'

function UpdateCadasterPage() {
    const [step, setStep] = useState(1);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [formErrors, setFormErrors] = useState('');
    const [selectedFields, setSelectedFields] = useState({
        nome: false,
        email: false,
        telefone: false,
    });
    const navigate = useNavigate();

    // Validação de Nome
    const validateName = (name) => {
        const regex = /^[a-zA-Z\s]+$/;
        return regex.test(name);
    };

    // Validação de Email
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleNextStep = () => {
        if (!selectedFields.nome && !selectedFields.email && !selectedFields.telefone) {
            setFormErrors('Selecione pelo menos um campo para atualizar.');
            return;
        }
        setFormErrors('');
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        const updatedData = {};

        updatedData['id'] = userId;
        if (selectedFields.nome && nome) updatedData.nome = nome;
        if (selectedFields.email && email) updatedData.email = email;
        if (selectedFields.telefone && telefone) updatedData.telefone = telefone;

        if (Object.keys(updatedData).length === 0) {
            setFormErrors('Nenhum dado para atualizar.');
            return;
        }

        setFormErrors('');

        const response = await fetch('http://localhost:3001/api/cliente/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Cadastro atualizado com sucesso:', data);
            setNome('');
            setEmail('');
            setTelefone('');
            navigate('/');
        } else {
            console.error('Erro ao atualizar o cadastro');
            setFormErrors('Erro ao atualizar o cadastro');
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
                <div className="upload-container-register-form">
                    <div className="upload-register-form">
                        {step === 1 && (
                            <>
                                <h2>Selecione os campos para atualizar: </h2>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedFields.nome}
                                        onChange={() => setSelectedFields({ ...selectedFields, nome: !selectedFields.nome })}
                                    />
                                    Nome
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedFields.email}
                                        onChange={() => setSelectedFields({ ...selectedFields, email: !selectedFields.email })}
                                    />
                                    E-mail
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedFields.telefone}
                                        onChange={() => setSelectedFields({ ...selectedFields, telefone: !selectedFields.telefone })}
                                    />
                                    Telefone
                                </label>
                                {formErrors && <p className="error">{formErrors}</p>}
                                <button onClick={handleNextStep}>Próximo</button>
                            </>
                        )}
                        {step === 2 && (
                            <div className="second-step">
                                <h2>Atualizar Cadastro</h2>
                                {selectedFields.nome && (
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
                                )}
                                {selectedFields.email && (
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
                                )}
                                {selectedFields.telefone && (
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
                                )}
                                {formErrors && <p className="error">{formErrors}</p>}
                                <button type="submit" onClick={handleSubmit}>Atualizar</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateCadasterPage;
