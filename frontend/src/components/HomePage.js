// src/components/HomePage.js
import React from 'react';
import Header from '../components/Header';
import '../styles/HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page-container">
            <main className="home-main-content">
                <h1>Добро пожаловать на главную страницу</h1>
                <p>Здесь вы можете найти информацию о мероприятиях, зарегистрироваться и создать свой профиль.</p>

            </main>
        </div>
    );
};

export default HomePage;