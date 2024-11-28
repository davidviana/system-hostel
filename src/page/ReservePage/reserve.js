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

    const handleConfirmReservation = async (e) => {
        let status = 'confirmada'

        try {
            const response = await fetch('http://localhost:3001/api/reserva/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: reserve.id, status }),
            });

            if (response.ok) {
                console.log("Reserva realizada com sucesso!");
                setIsModalOpen(false);
            } else {
                console.error("Erro ao fazer a reserva:", response.status);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    const handleCancelReservation = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <h2>Reservas Disponíveis</h2>
            {reserve.length > 0 ? (
                <div className="rooms-container">
                    {reserve.map(e => (
                        <button className='room-card' key={e.id} onClick={() => handleRoomSelection(e)}>
                            <h2>Reserva: {e.id}</h2>
                            <p>Status: <span className={getRoomStatusClass(e.status)}>{e.status}</span></p>
                            <p>Check-In: {formatDate(e.data_checkin)}</p>
                            <p>Check-Out: {formatDate(e.data_checkout)}</p>
                            <p>Valor: R$ {e.preco}</p>
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
        </div>
    );
}

export default ReservePage;
