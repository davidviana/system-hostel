import React, { useEffect, useState } from 'react';
import './room.css';

function RoomPage() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/api/quarto/all_rooms`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Erro ao buscar quartos:', error));
    }, []);

    // WebSocket setup
    useEffect(() => {
        const socket = new WebSocket('https://localhost:3001');

        socket.onopen = () => {
            console.log('WebSocket Connected');
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'reservationUpdate') {
                console.log('Received reservation update:', message);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket Closed');
        };

        return () => {
            socket.close();
        };
    }, []);

    const getRoomStatusClass = (status) => {
        switch (status) {
            case 'manutenção':
                return 'status manutencao';
            case 'ocupado':
                return 'status ocupado';
            case 'reservado':
                return 'status reservado';
            default:
                return 'status disponivel';
        }
    };

    return (
        <>
            <h2 id='room-title'>Quartos Disponíveis</h2>
            {rooms.length > 0 ? (
                <div className="roomspage-container">
                    {rooms.map(room => (
                        <div className='roompage-card' key={room.numero}>
                            <h2>Quarto: {room.numero}</h2>
                            <p>Status: <span className={getRoomStatusClass(room.status_quarto)}>{room.status_quarto}</span></p>
                            <p>Andar: {room.andar}°</p>
                            <p>{room.tipo}</p>
                            <p>Pessoas: {room.maximo_pessoas} hóspedes</p>
                            <p>Preço: R$ {room.preco}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nenhum quarto disponível para as datas selecionadas.</p>
            )}
        </>
    );
}

export default RoomPage;
