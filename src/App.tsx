import { Routes, Route } from 'react-router-dom';
import SplashPage from './components/SplashPage.tsx';
import './App.css'
import Dashboard from './components/Dashboard.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
  )
}

export default App
