import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary bat duoc loi:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold font-heading text-slate-800 mb-2">Đã xảy ra sự cố hiển thị</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Trang web gặp lỗi không mong muốn khi tải dữ liệu. Vui lòng thử tải lại trang hoặc quay về trang chủ.
            </p>
            {this.state.error?.message && (
              <div className="mb-6 p-3 bg-rose-50 rounded-xl text-rose-700 text-xs font-mono text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span>Tải lại trang</span>
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Home size={14} />
                <span>Trang chủ</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

