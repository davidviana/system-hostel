import React, { useEffect, useState } from 'react';
import './room.css';

function RoomPage() {

    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

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
                // Handle reservation update (e.g., confirmation or cancellation)
                console.log('Received reservation update:', message);
                // Update rooms or other states based on the message
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

    const handleRoomSelection = (room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleConfirmReservation = async () => {
        console.log('Reserva Confirmada');

        // Send reservation confirmation to the server (WebSocket)
        const socket = new WebSocket('ws://localhost:3001'); // Connect to WebSocket server
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'confirmReservation',
                roomNumber: selectedRoom.numero
            }));
        };

        // Close modal after confirmation
        setIsModalOpen(false);
    };

    const handleCancelReservation = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <h2 id='room-title'>Quartos Disponíveis</h2>
            {rooms.length > 0 ? (
                <div className="roomspage-container">
                    {rooms.map(room => (
                        <button className='roompage-card' key={room.numero} onClick={() => handleRoomSelection(room)}>
                            <h2>Quarto: {room.numero}</h2>
                            <p>Status: <span className={getRoomStatusClass(room.status_quarto)}>{room.status_quarto}</span></p>
                            <p>Andar: {room.andar}°</p>
                            <p>{room.tipo}</p>
                            <p>Pessoas: {room.maximo_pessoas} hóspedes</p>
                            <p>Preço: R$ {room.preco}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <p>Nenhum quarto disponível para as datas selecionadas.</p>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirmar Reserva</h3>
                        <p>Você deseja reservar o quarto {selectedRoom.numero}?</p>
                        <button onClick={handleConfirmReservation}>Confirmar</button>
                        <button onClick={handleCancelReservation}>Cancelar</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default RoomPage;
