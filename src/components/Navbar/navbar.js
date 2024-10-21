import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import Icon from '../../assets/default_profile_icon.png';
import Up from '../../assets/chevron_up.png';
import DeletePage from "../../page/DeletePage/delete";
import UpdateCadasterPage from "../../page/UpdateCadasterPage/update_cadaster";

function NavBar() {
    const [userName, setUserName] = useState("");
    const [isRotated, setIsRotated] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); 

    const profileMenu = () => {
        setIsMenuVisible(!isMenuVisible);
        setIsRotated(!isRotated);
    };

    const fetchUserName = async () => {
        const id = localStorage.getItem('userId');

        const response = await fetch(`http://localhost:3001/api/cliente/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            setUserName(data.nome);
        } else {
            console.log('Erro ao puxar o nome do usuário');
        }
    };

    useEffect(() => {
        if (localStorage.getItem('isLogged') === "true") {
            fetchUserName();
        }
    }, []);

    const isLogged = localStorage.getItem('isLogged') === "true";

    const openDeleteModal = () => {
        setIsDeleteModalVisible(true);
        setIsMenuVisible(false)
    };

    const closeDeleteModal = () => {
        setIsDeleteModalVisible(false);
    };

    return (
        <div className="navbar">
            <div className="navbar-container">
                <a href="/fotos">Fotos</a>
                <a href="/acomodacoes">Acomodações</a>
                <a href="/reservas">Minhas Reservas</a>
            </div>
            {isLogged ? (
                <div className="profile-section">
                    <div className="profile-button">
                        <div className="stacked-icon">
                            <img className='icon-default' src={Icon} alt="default-icon" />
                            <p>Olá, {userName}</p>
                        </div>
                        <button className='chevron' onClick={profileMenu}>
                            <img className={`chevron-icon ${isRotated ? 'rotate' : ''}`} src={Up} alt="chevron" />
                        </button>
                    </div>
                    {isMenuVisible && (
                        <div className="menu">
                            <ul>
                                <li><Link to='/update'>Atualizar cadastro</Link></li>
                                <li><button onClick={openDeleteModal}>Deletar cadastro</button></li>
                                <li>Sair</li>
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <button className="button-login">
                    <Link to="/cadaster">Cadastre-se</Link>
                </button>
            )}

            {isDeleteModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <DeletePage closeModal={closeDeleteModal} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavBar;
