import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import './comp_reserve.css';

function ReserveComponent() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [guestCount, setGuestCount] = useState('');
    const [modal, setModal] = useState(false);

    const navigate = useNavigate();

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start && end) closeModal();
    };

    const formatDate = (date) => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSearch = () => {
        if (!startDate || !endDate || !guestCount) {
            alert("Por favor, preencha todas as informações!");
            return;
        }

        let dias_de_estadia = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

        if (dias_de_estadia > 14) {
            alert("Por favor, insira um período até 14 dias")
            return;
        }

        navigate('/reserve', {
            state: { startDate, endDate, guestCount }
        });
    };

    return (
        <div>
            <div className='container-reserve'>
                <div className='container-date-range'>
                    <button onClick={openModal}>
                        {startDate ? `${formatDate(startDate)}` : 'Check-In'}
                    </button>
                    <button onClick={openModal}>
                        {endDate ? `${formatDate(endDate)}` : 'Check-Out'}
                    </button>
                </div>

                <div className='container-hospedes-range'>
                    <select 
                        id="guest-select"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}>
                        <option value="">Hóspede</option>
                        <option value="1">1 Hóspede</option>
                        <option value="2">2 Hóspedes</option>
                        <option value="3">3 Hóspedes</option>
                    </select>
                </div>

                <button type='button' id='button-buscar' onClick={handleSearch}>
                    Buscar
                </button>
            </div>

            {modal && (
                <div className="modal-container">
                    <DatePicker
                        selected={startDate}
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                    />
                </div>
            )}
        </div>
    );
}

export default ReserveComponent;
