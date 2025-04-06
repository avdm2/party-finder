// src/components/HomePageOrganizer.js
import React from 'react';
import Header from '../Header';
import '../../styles/HomePage.css';

const HomePageParticipant = () => {
    return (
        <div className="home-page-container">
            <main className="home-main-content">
                <h1>Добро пожаловать на главную страницу</h1>
                <p>Здесь вы можете найти информацию о мероприятиях, зарегистрироваться и создать свой профиль.</p>
            </main>
        </div>
    );
};

export default HomePageParticipant;