import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import MenuBar from './components/MenuBar';
import CarouselHome from './components/CarouselHome';
import YearArchive from './pages/YearArchive';
import YearArchiveList from './pages/YearArchiveList';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import SplashScreen from './components/SplashScreen';

function AppRoutes({ isAdmin, setIsAdmin }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/login' && <MenuBar onNavigate={navigate} />}
      <Routes>
        <Route path="/" element={<CarouselHome />} />
        <Route path="/archive" element={<YearArchiveList />} />
        <Route path="/archive/:year" element={<YearArchive />} />
        <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={() => { setIsAdmin(true); navigate('/admin'); }} />} />
        <Route path="*" element={<CarouselHome />} />
      </Routes>
    </>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  return (
    <div className="App">
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <Router>
          <AppRoutes isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        </Router>
      )}
    </div>
  );
}

export default App;
