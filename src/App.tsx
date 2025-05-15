import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SplashPage from './components/SplashPage.tsx';
import './App.css'
import Dashboard from './components/Dashboard.tsx';

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [count, setCount] = useState(0)

  const handleEnter = () => {
    setHasEntered(true);
  }

  return (
    <Routes>
      <Route path="/" element={<SplashPage/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
  )
}

export default App
