import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './comp_reserve.css';

function ReserveComponent() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [guestCount, setGuestCount] = useState(''); 
    const [modal, setModal] = useState(false);

    const openModal = () => {
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
    };

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            closeModal();
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
                        <option value="4">4 Hóspedes</option>
                        <option value="5">5 Hóspedes</option>
                    </select>
                </div>

                <button type='submit' id='button-buscar'>
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
