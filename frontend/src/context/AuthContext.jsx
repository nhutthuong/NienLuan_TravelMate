import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    if (window.google?.accounts?.id?.disableAutoSelect) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  const loadUserProfile = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      return;
    }

    try {
      const data = await api.auth.getMe();
      setUser({
        maNguoiDung: data.maNguoiDung,
        hoTen: data.hoTen,
        email: data.email,
        avatarUrl: data.avatarUrl,
        ngaySinh: data.ngaySinh,
        vaiTro: data.vaiTro,
        trangThai: data.trangThai,
        phuongThucXacThuc: data.phuongThucXacThuc,
        createdAt: data.createdAt,
        soThich: Array.isArray(data.soThich) ? data.soThich : [],
      });
    } catch (err) {
      console.error('Khong the xac thuc phien lam viec:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadUserProfile();

    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        const newToken = e.newValue;
        setToken(newToken);
        if (newToken) {
          loadUserProfile();
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadUserProfile]);

  const login = async (email, matKhau) => {
    const res = await api.auth.login(email, matKhau);
    const { token: receivedToken, user: receivedUser } = res;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    return res;
  };

  const register = async ({ hoTen, email, matKhau, maLoaiHinhList = [] }) => {
    const res = await api.auth.register({ hoTen, email, matKhau, maLoaiHinhList });
    const { token: receivedToken, user: receivedUser } = res;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    return res;
  };

  const loginWithGoogle = async (credential) => {
    const res = await api.auth.google(credential);
    const { token: receivedToken, user: receivedUser } = res;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    return res;
  };

  const updatePreferences = async (maLoaiHinhList) => {
    const res = await api.auth.updatePreferences(maLoaiHinhList);
    const newPreferences = res.soThich || maLoaiHinhList;
    setUser((prev) => (prev ? { ...prev, soThich: newPreferences } : null));
    return newPreferences;
  };

  const updateProfile = useCallback(async (profileData) => {
    const res = await api.auth.updateProfile(profileData);
    if (res?.user) {
      setUser((prev) => (prev ? { ...prev, ...res.user } : res.user));
    }
    return res;
  }, []);

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.vaiTro === 'Admin';

  const value = {
    token,
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    loginWithGoogle,
    logout,
    updatePreferences,
    updateProfile,
    reloadProfile: loadUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phai duoc su dung ben trong AuthProvider');
  }
  return context;
};

export default AuthContext;
