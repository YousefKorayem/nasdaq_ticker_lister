import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashPage.css';
import logo from '../assets/logo.svg';

interface SplashPageProps {
    onEnter: () => void;
}

const SplashPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.classList.add('fade-out');
            setTimeout(() => navigate('/dashboard'), 1000);
        }, 3000);

        return () => clearTimeout(timer);

    }, [navigate]);

    return (
        <div className="splash-container flex-grow-1 overflow-auto text-light p-3">
            <div className="splash-content py-4">
                <img src={logo} alt="Nasdaq Logo" className="splash-logo" />
                <h1 className="splash-heading">Nasdaq Directory</h1>
                <p className="splash-author">By Yousef Korayem</p>
            </div>
        </div>
    )
};

export default SplashPage;