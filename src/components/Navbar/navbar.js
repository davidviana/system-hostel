import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import Icon from '../../assets/default_profile_icon.png';
import Up from '../../assets/chevron_up.png';
import DeletePage from "../../page/DeletePage/delete";
import DeleteColabPage from "../../page/DeleteColabPage/delete_colab";

function NavBar({ funcionarios, quartos, reservas }) {
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("");
    const [isRotated, setIsRotated] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isDeleteColabModalVisible, setIsDeleteColabModalVisible] = useState(false);
    const navigate = useNavigate();

    const profileMenu = () => {
        setIsMenuVisible(!isMenuVisible);
        setIsRotated(!isRotated);
    };

    const fetchUserName = async () => {
        const id = localStorage.getItem('userId');

        const response = await fetch(`http://localhost:3001/api/funcionario/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            let first_name = data.nome.split(' ')[0];
            let last_name = data.nome.split(' ').slice(-1)[0];
            const nome_completo = first_name + ' ' + last_name;
            const cargo = data.cargo;
            setUserName(nome_completo);
            setRole(cargo);
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
        setIsMenuVisible(false);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalVisible(false);
    };

    const openDeleteColabModal = () => {
        setIsDeleteColabModalVisible(true);
        setIsMenuVisible(false);
    };

    const closeDeleteColabModal = () => {
        setIsDeleteColabModalVisible(false);
    };

    const closeSession = () => {
        localStorage.clear();
        navigate('/');
    };

    const shotDown = async () => {
        const response = await fetch('http://localhost:3001/api/shutdown', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role }),
        });

        if (response.ok) {
            setTimeout(() => {
                localStorage.clear()
                navigate('/')
            }, 1000);
        } else {
            return 'Error'
        }
    }

    return (
        <div className="navbar">
            <div className="navbar-container">
                <a href={funcionarios}>Funcionários</a>
                <a href={quartos}>Quartos</a>
                <a href={reservas}>Reservas</a>
            </div>
            {isLogged ? (
                <div className="profile-section">
                    <div className="profile-button">
                        <div className="stacked-icon">
                            <img className='icon-default' src={Icon} alt="default-icon" />
                            <div id='nome-role'>
                                <p>Olá, {userName}</p>
                            </div>
                        </div>
                        <button className='chevron' onClick={profileMenu}>
                            <img className={`chevron-icon ${isRotated ? 'rotate' : ''}`} src={Up} alt="chevron" />
                        </button>
                    </div>
                    {isMenuVisible && (
                        (role === 'Gerente' || role === 'Tecníco de TI') ? (
                            <div className="menu">
                                <ul>
                                    <p>Funcionários</p>
                                    <Link className="menu-item" to='/cadaster_colab'><li>Cadastrar funcionário</li></Link>
                                    <Link className="menu-item" to='/update_colab'><li>Atualizar funcionário</li></Link>
                                    <Link className="menu-item" onClick={openDeleteColabModal}><li>Deletar funcionário</li></Link>
                                    <p>Clientes</p>
                                    <Link className="menu-item" to='/cadaster'><li>Cadastrar cliente</li></Link>
                                    <Link className="menu-item" to='/update'><li>Atualizar cliente</li></Link>
                                    <Link className="menu-item" onClick={openDeleteModal}><li>Deletar cliente</li></Link>
                                    <p>Sistema</p>
                                    <Link className="menu-item" onClick={closeSession}><li>Sair</li></Link>
                                    <Link className="menu-item" onClick={shotDown}><li>Desligar o sistema</li></Link>
                                </ul>
                            </div>
                        ) : (
                            <div className="menu">
                                <ul>
                                    <p>Clientes</p>
                                    <Link className="menu-item" to='/cadaster'><li>Criar o cadastro</li></Link>
                                    <Link className="menu-item" to='/update'><li>Atualizar o cadastro</li></Link>
                                    <Link className="menu-item" onClick={openDeleteModal}><li>Deletar o cadastro</li></Link>
                                    <Link className="menu-item" onClick={closeSession}><li>Sair</li></Link>
                                </ul>
                            </div>
                        )
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

            {isDeleteColabModalVisible && (
                <DeleteColabPage closeModal={closeDeleteColabModal} />
            )}
        </div>
    );
}

export default NavBar;
