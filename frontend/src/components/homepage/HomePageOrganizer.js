// src/components/HomePageParticipant.js
import React from 'react';
import Header from '../Header';
import '../../styles/HomePage.css';

const HomePageOrganizer = () => {
    return (
        <div className="home-page-container">
            <main className="home-main-content">
                <h1>Добро пожаловать на главную страницу</h1>
                <p>Здесь вы можете создать мероприятие, зарегистрироваться и создать свой профиль.</p>
            </main>
        </div>
    );
};

export default HomePageOrganizer;