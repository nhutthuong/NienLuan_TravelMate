import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import LocationDetail from './pages/LocationDetail';
import ServiceDetail from './pages/ServiceDetail';
import Wishlist from './pages/Wishlist';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import './index.css';

function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={isAdmin ? "h-screen w-full overflow-hidden" : "app-container"}>
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "h-full w-full overflow-hidden" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/location/:id" element={<LocationDetail />} />
          <Route path="/service/:type/:id" element={<ServiceDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          {/* Add more routes later */}
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
