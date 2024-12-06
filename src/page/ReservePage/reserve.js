import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './reserve.css';

function ReservePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { startDate, endDate, guestCount } = location.state || {};
    const [price, setPrice] = useState();
    const dias_de_estadia = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const total_value = price * dias_de_estadia === 0 ? price * 1 : price * dias_de_estadia;

    const formatDate = (date) => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const calendarDate = (date) => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/api/quarto/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const filteredRooms = data.filter(room => room.maximo_pessoas >= guestCount);
                setRooms(filteredRooms);
            })
            .catch(error => console.error('Erro ao buscar quartos:', error));
    }, [startDate, endDate, guestCount]);

    const getRoomStatusClass = (status) => {
        switch (status) {
            case 'manutenção':
                return 'status manutencao';
            case 'ocupado':
                return 'status ocupado';
            default:
                return 'status disponivel';
        }
    };

    const handleRoomSelection = (room) => {
        setSelectedRoom(room);
        setPrice(room.preco);
        setIsModalOpen(true);
    };

    const handleConfirmReservation = async (e) => {
        let date = new Date();
        const date_reserva = formatDate(date);
        const data_checkin = formatDate(startDate);
        const data_checkout = formatDate(endDate);
        const cliente_id = localStorage.getItem("userId");
        const room_number = selectedRoom.numero;

        try {
            const response = await fetch('http://localhost:3001/api/reserva/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date_reserva, data_checkin, data_checkout, cliente_id, room_number, dias_de_estadia, total_value }),
            });

            if (response.ok) {
                const socket = new WebSocket('ws://localhost:3001');
                socket.onopen = () => {
                    const message = {
                        type: 'reservationUpdate',
                        status: 'created',
                        dataCheckin: data_checkin,
                        dataCheckout: data_checkout,
                        roomId: room_number,
                        roomNumber: selectedRoom.numero,
                        totalValue: 'default'
                    };
                    socket.send(JSON.stringify(message));
                    socket.close();
                };

                setIsModalOpen(false);
                setTimeout(() => navigate('/home'), 3000);
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
        <>
            <h2 id='reserve-title'>Quartos Disponíveis</h2>
            {rooms.length > 0 ? (
                <div className="rooms-container">
                    {rooms.map(room => (
                        <button className='room-card' key={room.numero} onClick={() => handleRoomSelection(room)} >
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

            {isModalOpen && selectedRoom && (
                <div className="modal">
                    <div className="modal-content">
                        <div id='modal-text-contente'>
                            <h3>Confirmar Reserva</h3>
                            <p>Você deseja prosseguir com a reserva nas seguintes condições:</p>
                            <p><b>Quarto:</b> {selectedRoom.numero} |  <b>Período:</b> {dias_de_estadia === 0 || dias_de_estadia === 1 ? `1 dia` : `${dias_de_estadia} dias`}</p>
                            <p>Entrada: {calendarDate(startDate)}</p>
                            <p>Saída: {calendarDate(endDate)}</p>
                            <p><b>Valor Total:</b> R${price * dias_de_estadia === 0 ? price * 1 : price * dias_de_estadia},00 </p>
                            <span id='alert'>* O pagamento ocorrerá no local, no momento do check-in</span>
                        </div>
                        <button onClick={handleConfirmReservation}>Confirmar</button>
                        <button onClick={handleCancelReservation}>Cancelar</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ReservePage;