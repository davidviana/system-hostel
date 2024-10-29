import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function ReservePage() {
    const location = useLocation();
    const { startDate, endDate, guestCount } = location.state || {};
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        if (1==1) {
            fetch(`http://localhost:3001/api/quarto/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => setRooms(data))
                .catch(error => console.error('Erro ao buscar quartos:', error))
                console.log(rooms);
        }
    }, [startDate, endDate, guestCount]);

    return (
        <div>
            <h2>Quartos Disponíveis</h2>
            {rooms.length > 0 ? (
                <ul>
                    {rooms.map(room => (
                        <li key={room.numero}>
                            <h3>{room.tipo}</h3>
                            <p>Capacidade: {room.maximo_pessoas} hóspedes</p>
                            <p>Preço: R$ {room.preco}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhum quarto disponível para as datas selecionadas.</p>
            )}
        </div>
    );
}

export default ReservePage;
