import React, { useEffect, useState } from 'react'; 
import { useLocation } from 'react-router-dom'; 
import './reserve.css'; // Para adicionar o estilo CSS

function ReservePage() { 
    const location = useLocation(); 
    const { startDate, endDate, guestCount } = location.state || {}; 
    const [rooms, setRooms] = useState([]);

    useEffect(() => { 
        if (1 === 1) { 
            fetch(`http://localhost:3001/api/quarto/`, { 
                method: 'GET', 
                headers: { 
                    'Content-Type': 'application/json' 
                } 
            }) 
            .then(response => response.json()) 
            .then(data => setRooms(data)) 
            .catch(error => console.error('Erro ao buscar quartos:', error)); 
        } 
    }, [startDate, endDate, guestCount]);

    // Função para determinar a classe do status
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

    return ( 
        <div> 
            <h2>Quartos Disponíveis</h2> 
            {rooms.length > 0 ? ( 
                <div className="rooms-container">
                    {rooms.map(room => (
                        <div className='room-card' key={room.numero}>
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
        </div> 
    ); 
}

export default ReservePage;
