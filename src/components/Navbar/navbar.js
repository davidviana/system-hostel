import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import Icon from '../../assets/default_profile_icon.png';
import Up from '../../assets/chevron_up.png';
import DeletePage from "../../page/DeletePage/delete";

function NavBar({ fotos, acomodacoes, reservas }) {
    const [userName, setUserName] = useState("");
    const [isRotated, setIsRotated] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const navigate = useNavigate()

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
            let first_name = data.nome.split(' ')[0]
            let last_name =  data.nome.split(' ').slice(-1)[0]
            const nome_completo = first_name + ' ' + last_name
            setUserName(nome_completo);
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

    const closeSession = () => {
        localStorage.clear()
        window.location.reload(true)
        navigate('/')
    }

    const closeDeleteModal = () => {
        setIsDeleteModalVisible(false);
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="navbar">
            <div className="navbar-container">
                <a href={fotos}>Fotos</a>
                <a href={acomodacoes}>Acomodações</a>
                <a href={reservas}>Reservas</a>
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
                                <Link className="menu-item" to='/update'><li>Atualizar cadastro</li></Link>
                                <Link className="menu-item" onClick={openDeleteModal}><li>Deletar cadastro</li></Link>
                                <Link className="menu-item" onClick={closeSession}><li>Sair</li></Link>
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
                <DeletePage closeModal={closeDeleteModal} />
            )}
        </div>
    );
}

export default NavBar;
