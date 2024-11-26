import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './reserve.css';

function ReservePage() {
    const location = useLocation();
    const { startDate, endDate, guestCount } = location.state || {}; // Dados recebidos da navegação
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/api/quarto/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Erro ao buscar quartos:', error));

        console.log("Datas:", startDate, endDate, "Hóspedes:", guestCount);
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

    const openModal = () => {
        
    }

    const selectedRoom = (numero) => {
        console.log("Quarto selecionado:", numero);
    };

    return (
        <>
            <h2 id='reserve-title'>Quartos Disponíveis</h2>
            {rooms.length > 0 ? (
                <div className="rooms-container">
                    {rooms.map(room => (
                        <button className='room-card' key={room.numero} onClick={() => selectedRoom(room.numero)} >
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
        </>
    );
}

export default ReservePage;
