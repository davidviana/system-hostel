import React, { useState } from "react";
import InputMask from 'react-input-mask';
import './delete_colab.css'

function DeleteColabPage({ closeModal }) {
    const [step, setStep] = useState(0);
    const [document, setDocument] = useState('');
    const [formErrors, setFormErrors] = useState('');

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

    const cancelDelete = () => {
        closeModal();
    }

    const checkCadaster = async () => {
        const response = await fetch(`http://localhost:3001/api/funcionario/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ document })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("colabId", data.id)
            var current_step = step
            var next_step = current_step + 1
            setStep(next_step);
        } else (
            setFormErrors('Preencha o campo para atualizar.')
        )
    }

    const confirmDelete = async () => {
        const colabId = localStorage.getItem('colabId');
        const response = await fetch(`http://localhost:3001/api/funcionario/${colabId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            closeModal();
            localStorage.setItem('colabId', '')
        } else {
            setFormErrors('Erro ao deletar o cadastro')
        }
    }

    return (
        <div className="modal">
            {step === 0 && (
                <div className="modal-content">
                    <h3>Informe o CPF do funcionario:</h3>
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
                    {formErrors && <p className="error">{formErrors}</p>}
                    <div className="container-button">
                        <button onClick={checkCadaster}>Próximo</button>
                        <button onClick={cancelDelete}>Cancelar</button>
                    </div>
                </div>
            )}
            {step === 1 && (
                <div className="modal-content">
                    <p>Deseja realizar a exclusão do cadastro?</p>
                    <div>
                        <button onClick={confirmDelete}>Confirmar</button>
                        <button onClick={cancelDelete}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeleteColabPage;
