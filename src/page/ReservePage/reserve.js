import React, { useEffect, useState } from 'react';
import './reserve.css';

function ReservePage() {
    const [reserve, setReserve] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/api/reserva/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => setReserve(data))
            .catch(error => console.error('Erro ao buscar as reservas:', error));
    }, []);

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getRoomStatusClass = (status) => {
        switch (status) {
            case 'ativa':
                return 'status manutencao';
            case 'cancelada':
                return 'status ocupado';
            default:
                return 'status disponivel';
        }
    };

    const handleRoomSelection = (room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleConfirmReservation = async () => {
        if (!selectedRoom) return;

        try {
            const response = await fetch('http://localhost:3001/api/reserva/confirmar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reserva_id: selectedRoom.id,  // A reserva selecionada
                    room_number: selectedRoom.quarto_id,  // O número do quarto (ou id)
                }),
            });

            if (response.ok) {
                console.log("Reserva confirmada com sucesso!");
                setIsModalOpen(false); // Fecha o modal após confirmação
            } else {
                console.error("Erro ao confirmar reserva:", response.status);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    const handleCancelReservation = async () => {
        if (!selectedRoom) return;

        try {
            const response = await fetch('http://localhost:3001/api/reserva/cancelar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reserva_id: selectedRoom.id,
                    room_number: selectedRoom.quarto_id,
                }),
            });

            if (response.ok) {
                console.log("Reserva cancelada com sucesso!");
                setIsModalOpen(false);
            } else {
                console.error("Erro ao confirmar reserva:", response.status);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    return (
        <div>
            <h2>Reservas Disponíveis</h2>
            {reserve.length > 0 ? (
                <div className="rooms-container">
                    {reserve.map((e) => (
                        <button
                            className='room-card'
                            key={e.id}
                            onClick={() => handleRoomSelection(e)}
                        >
                            <h2>Reserva: {e.id}</h2>
                            <p>Status: <span className={getRoomStatusClass(e.status)}>{e.status}</span></p>
                            <p>Check-In: {formatDate(e.data_checkin)}</p>
                            <p>Check-Out: {formatDate(e.data_checkout)}</p>
                            <p>Quarto: {e.quarto_id}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <p>Nenhum quarto disponível para as datas selecionadas.</p>
            )}

            {isModalOpen && selectedRoom && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirmar Reserva</h3>
                        <p>Você deseja reservar o quarto {selectedRoom.quarto_id}?</p>
                        <button onClick={handleConfirmReservation}>Confirmar</button>
                        <button onClick={handleCancelReservation}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReservePage;
