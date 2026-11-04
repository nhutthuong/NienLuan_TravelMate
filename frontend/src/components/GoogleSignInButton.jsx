import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const GoogleSignInButton = ({
  text = 'signin_with',
  onSuccess,
  onError,
  className = '',
}) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const tokenClientRef = useRef(null);

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const loginWithGoogleRef = useRef(loginWithGoogle);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    loginWithGoogleRef.current = loginWithGoogle;
  });

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID chua duoc thiet lap');
      return;
    }

    const initClient = () => {
      if (!window.google?.accounts?.oauth2) return false;
      try {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              if (onErrorRef.current) onErrorRef.current(new Error(tokenResponse.error));
              return;
            }
            if (!tokenResponse.access_token) return;
            setLoading(true);
            try {
              const res = await loginWithGoogleRef.current(tokenResponse.access_token);
              if (onSuccessRef.current) onSuccessRef.current(res);
            } catch (err) {
              if (onErrorRef.current) onErrorRef.current(err);
            } finally {
              setLoading(false);
            }
          },
        });
        return true;
      } catch (err) {
        console.error('Loi khoi tao Google OAuth client:', err);
        return false;
      }
    };

    if (!initClient()) {
      const interval = setInterval(() => {
        if (initClient()) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  const handleClick = () => {
    if (loading) return;
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
    } else {
      alert('Dang khoi tao ket noi Google, vui long thu lai trong giay lat.');
    }
  };

  const label = text === 'signup_with' ? 'Đăng ký bằng Google' : 'Đăng nhập bằng Google';

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-sm font-semibold text-slate-700 text-sm cursor-pointer disabled:opacity-60"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>{label}</span>
      </button>
      {loading && (
        <p className="text-xs text-sky-600 font-medium text-center mt-2 animate-pulse">
          Đang xác thực tài khoản Google...
        </p>
      )}
    </div>
  );
};

export default React.memo(GoogleSignInButton);
