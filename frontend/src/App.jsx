import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import { useAuth } from './context/AuthContext';
import './index.css';

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Đang xác thực quyền quản trị...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, error: 'Vui lòng đăng nhập tài khoản Quản trị viên để truy cập trang này.' }}
      />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace state={{ unauthorized: true, message: 'Bạn không có quyền truy cập vào trang quản trị (yêu cầu vai trò Admin).' }} />;
  }

  return children;
}

function MainLayout() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const isAdminPath = location.pathname.startsWith('/admin');
  const showAdminLayout = isAdminPath && !loading && isAuthenticated && isAdmin;

  return (
    <div className={showAdminLayout ? "h-screen w-full overflow-hidden" : "min-h-screen flex flex-col bg-slate-50"}>
      {!showAdminLayout && <Navbar />}
      <main className={showAdminLayout ? "h-full w-full overflow-hidden" : "flex-1 flex flex-col"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/hotels" element={<Explore defaultTab="hotels" />} />
          <Route path="/location/:id" element={<LocationDetail />} />
          <Route path="/service/:type/:id" element={<ServiceDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          {/* Add more routes later */}
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return <MainLayout />;
}

export default App;
