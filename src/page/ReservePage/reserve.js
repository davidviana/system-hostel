import React, { useEffect, useState } from 'react';
import './reserve.css';

function ReservePage() {
    const [reserveToday, setReserveToday] = useState([]);
    const [reserveFuture, setReserveFuture] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3001');

        socket.onopen = () => {
            console.log('Conexão WebSocket aberta');
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Mensagem recebida do servidor WebSocket:', message);

            if (message.type === 'reservationUpdate') {
                console.log('Mensagem de atualização de reserva recebida', message);
                setReserveToday((prevReserve) => {
                    console.log('Estado anterior:', prevReserve);
                    if (message.status === 'created') {
                        return [
                            ...prevReserve,
                            { id: message.roomId, status: 'ativa', quarto_id: message.roomNumber }
                        ];
                    } else if (message.status === 'canceled') {
                        return prevReserve.map((reserva) =>
                            reserva.quarto_id === message.roomId
                                ? { ...reserva, status: 'cancelada' }
                                : reserva
                        );
                    } else if (message.status === 'confirmed') {
                        return prevReserve.map((reserva) =>
                            reserva.quarto_id === message.roomId
                                ? { ...reserva, status: 'concluída' }
                                : reserva
                        );
                    }
                    return prevReserve;
                });
            }
        };

        socket.onclose = () => {
            console.log('Conexão WebSocket fechada');
        };

        socket.onerror = (error) => {
            console.error('Erro no WebSocket:', error);
        };

        fetch(`http://localhost:3001/api/reserva/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const today = new Date();
                const todayFormatted = today.toISOString().split('T')[0]; // Ex: "2024-12-05"

                const todayReservations = [];
                const futureReservations = [];

                data.forEach(reserva => {
                    const reservaCheckin = reserva.data_checkin.split('T')[0]; // Formato da data de check-in: "2024-12-05"
                    if (reservaCheckin === todayFormatted) {
                        todayReservations.push(reserva);
                    } else if (reservaCheckin > todayFormatted) {
                        futureReservations.push(reserva);
                    }
                });

                setReserveToday(todayReservations);
                setReserveFuture(futureReservations);
            })
            .catch(error => console.error('Erro ao buscar as reservas:', error));

        return () => {
            socket.close();
        };
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

    const getCheckStatusClass = (status) => {
        switch (status) {
            case 'Realizado':
                return 'status disponivel';
            default:
                return 'status ocupado';
        }
    };

    const handleRoomSelection = (room) => {
        setSelectedRoom(room);
        if (room.is_checkin === true && room.is_checkout === false) {
            setIsModalOpen(true);
        } else if (room.is_checkin === false && room.is_checkout === false) {
            setIsModalOpen(true);
        }
    };

    const handleConfirmCheckOut = async () => {
        if (!selectedRoom) return;

        try {
            const response = await fetch('http://localhost:3001/api/reserva/checkout', {
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
                setIsModalOpen(false);
            } else {
                console.error("Erro ao realizar o Check-Out:", response.status);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
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
                setIsModalOpen(false);
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
                setIsModalOpen(false);
            } else {
                console.error("Erro ao confirmar reserva:", response.status);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <h2>Reservas para Hoje</h2>
            {reserveToday.length > 0 ? (
                <div className="rooms-container">
                    {reserveToday.map((e) => (
                        <button
                            key={e.id}
                            className='room-card'
                            onClick={() => handleRoomSelection(e)} >
                            <h2>Reserva: {e.id}</h2>
                            <p>Status: <span className={getRoomStatusClass(e.status)}>{e.status}</span></p>
                            <p>Data de Entrada: {formatDate(e.data_checkin)}</p>
                            <p>Data de Saída: {formatDate(e.data_checkout)}</p>
                            <p>Check-In: <span className={getCheckStatusClass(String(e.is_checkin) === 'true' ? 'Realizado' : 'Não Realizado')}>{String(e.is_checkin) === 'true' ? 'Realizado' : 'Não Realizado'}</span></p>
                            <p>Check-Out: <span className={getCheckStatusClass(String(e.is_checkout) === 'true' ? 'Realizado' : 'Não Realizado')}>{String(e.is_checkout) === 'true' ? 'Realizado' : 'Não Realizado'}</span></p>
                            <p>Quarto: {e.quarto_id}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <p>Nenhuma reserva para hoje.</p>
            )}

            <h2>Reservas Futura (Check-In Após Hoje)</h2>
            {reserveFuture.length > 0 ? (
                <div className="rooms-container">
                    {reserveFuture.map((e) => (
                        <button
                            key={e.id}
                            className='room-card'
                            onClick={() => handleRoomSelection(e)} >
                            <h2>Reserva: {e.id}</h2>
                            <p>Status: <span className={getRoomStatusClass(e.status)}>{e.status}</span></p>
                            <p>Data de Entrada: {formatDate(e.data_checkin)}</p>
                            <p>Data de Saída: {formatDate(e.data_checkout)}</p>
                            <p>Check-In: <span className={getCheckStatusClass(String(e.is_checkin) === 'true' ? 'Realizado' : 'Não Realizado')}>{String(e.is_checkin) === 'true' ? 'Realizado' : 'Não Realizado'}</span></p>
                            <p>Check-Out: <span className={getCheckStatusClass(String(e.is_checkout) === 'true' ? 'Realizado' : 'Não Realizado')}>{String(e.is_checkout) === 'true' ? 'Realizado' : 'Não Realizado'}</span></p>
                            <p>Quarto: {e.quarto_id}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <p>Nenhuma reserva futura.</p>
            )}

            {isModalOpen && selectedRoom && (
                <div className="modal">
                    <div className="modal-content">
                        {selectedRoom.is_checkin === true && selectedRoom.is_checkout === false ? (
                            <>
                                <h3>Confirmar Check-Out</h3>
                                <p>Você deseja realizar o Check-Out do quarto {selectedRoom.quarto_id}?</p>
                                <button onClick={handleConfirmCheckOut}>Confirmar</button>
                                <button onClick={handleCancelReservation}>Cancelar</button>
                                <button onClick={closeModal}>Fechar</button>
                            </>
                        ) : (
                            <>
                                <h3>Confirmar Reserva</h3>
                                <p>Você deseja realizar o Check-In no quarto {selectedRoom.quarto_id}?</p>
                                <button onClick={handleConfirmReservation}>Confirmar</button>
                                <button onClick={handleCancelReservation}>Cancelar</button>
                                <button onClick={closeModal}>Fechar</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReservePage;
