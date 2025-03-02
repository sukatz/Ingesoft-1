import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useMatchmaking from '../hooks/useMatchmaking';
import styles from './Home.module.css';
import logo from '../assets/logo.png';

const SearchForm = ({ nickname, isSearching, onNicknameChange, onSearch }) => {
    const maxLength = 20;

    return (
        <form className={styles.form} onSubmit={onSearch}>
            <input
                className={styles.nicknameField}
                type="text"
                placeholder="Ingresa tu nickname"
                value={nickname}
                onChange={onNicknameChange}
                maxLength={maxLength}
                autoFocus
                disabled={isSearching}
            />
            <input
                className={styles.searchButton}
                type="submit"
                value="Buscar Partida"
                disabled={nickname.trim().length === 0 || isSearching}
            />
        </form>
    );
};

const LoadingSpinner = () => (
    <div className={styles.spinner}>
        <div className={styles.spinnerCircle}></div>
    </div>
);

function Home() {
    const [nickname, setNickname] = useState('');
    const [shouldSearch, setShouldSearch] = useState(false);
    const navigate = useNavigate();

    const { matchId, isSearching, error } = useMatchmaking(shouldSearch, nickname);

    const handleNicknameChange = (e) => {
        const value = e.target.value.replace(/[^A-Za-z]/g, '');
        if (value.length <= 20) {
            setNickname(value);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (nickname.trim().length > 0) {
            setShouldSearch(true);
        }
    };

    useEffect(() => {
        if (matchId) {
            navigate(`/game/${matchId}`);
        }
    }, [matchId, navigate]);

    return (
        <div className={styles.mainContainer}>
            <img className={styles.logo} src={logo} alt="Logo" />

            <SearchForm
                nickname={nickname}
                isSearching={isSearching}
                onNicknameChange={handleNicknameChange}
                onSearch={handleSearch}
            />

            {isSearching && <LoadingSpinner />}

            {error && <p className={styles.error}>Error: {error}</p>}
        </div>
    );
}

export default Home;