import React from "react";
import { useNavigate } from "react-router-dom";

function DeletePage() {
    const navigate = useNavigate();

    const cancelDelete = () => {
        console.log('Cancelar');
    }

    const confirmDelete = async () => {
        const userId = localStorage.getItem('userId');
        console.log(userId);

        const response = await fetch(`http://localhost:3001/api/cliente/${userId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            console.log('Deletado com sucesso');
            localStorage.clear();
            navigate('/login');
        } else {
            console.error('Erro ao deletar o cadastro');
        }
    }

    return (
        <div>
            <p>Deseja realizar a exclusão do seu cadastro?</p>
            <div>
                <button onClick={confirmDelete}>Confirmar</button>
                <button onClick={cancelDelete}>Cancelar</button>
            </div>
        </div>
    );
}

export default DeletePage;