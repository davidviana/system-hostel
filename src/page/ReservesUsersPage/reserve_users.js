import React, { useEffect, useState } from 'react';
import './reserve_users.css';

function ReserveUsersPage() {
    const formatDate = (date) => {
        if (!date) return '';  
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return ''; 
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year = parsedDate.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cliente_id = localStorage.getItem('userId');

        fetch(`http://localhost:3001/api/reserva/${cliente_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setRooms(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erro ao buscar quartos:', error);
                setError('Erro ao buscar quartos. Tente novamente mais tarde.');
                setLoading(false);
            });
    }, []);

    const roomStatusClasses = {
        ativa: 'status manutencao',
        cancelada: 'status ocupado',
        default: 'status disponivel'
    };

    const getRoomStatusClass = (status) => roomStatusClasses[status] || roomStatusClasses.default;

    return (
        <>
            <h2 id='reserve-title'>Minhas Reservas</h2>
            {loading ? (
                <p>Carregando...</p>
            ) : error ? (
                <p>{error}</p>
            ) : rooms.length > 0 ? (
                <div className="rooms-container">
                    {rooms.map(room => (
                        <div className='room-card' key={room.id}>
                            <h2>Reserva: {room.id}</h2>
                            <p>Status: <span className={getRoomStatusClass(room.status)}>{room.status}</span></p>
                            <p>Check-In: {formatDate(room.data_checkin)}</p>
                            <p>Check-Out: {formatDate(room.data_checkout)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nenhum quarto disponível para as datas selecionadas.</p>
            )}
        </>
    );
}

export default ReserveUsersPage;
