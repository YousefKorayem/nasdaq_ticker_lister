import React from 'react';
import './SplashPage.css';
import logo from '../assets/logo.svg';

interface SplashPageProps {
    onEnter: () => void;
}

const SplashPage: React.FC<SplashPageProps> = ({ onEnter }) => {
    return (
        <div className="splash-container">
            <img src={logo} alt="Nasdaq Logo" className="splash-logo"/>
            <h1 className="splash-heading">Nasdaq Tracker</h1>
            <p>By Yousef Korayem</p>
            <button className="splash-button" onClick={onEnter}>Start</button>
        </div>
    )
}

export default SplashPage;