import React, { useState } from 'react'
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
    <>
      {hasEntered ? (
        <Dashboard/>
      ) : (
        <SplashPage onEnter={handleEnter}/>
      )}
    </>
  )
}

export default App
