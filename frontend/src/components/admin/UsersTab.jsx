import React from 'react';
import { Search, Lock, Unlock, CheckCircle, AlertTriangle } from 'lucide-react';

const UsersTab = ({
  users,
  searchQuery,
  setSearchQuery,
  onToggleUserBan
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm tên, email thành viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
          />
        </div>
        <div className="text-xs text-slate-500">
          Tổng <span className="font-bold text-slate-800">{users.length}</span> người dùng
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">ID</th>
              <th className="py-3.5 px-5">Họ tên &amp; Email</th>
              <th className="py-3.5 px-5">Vai trò (Role)</th>
              <th className="py-3.5 px-5">Lượt quét AI</th>
              <th className="py-3.5 px-5">Yêu thích</th>
              <th className="py-3.5 px-5">Ngày tạo</th>
              <th className="py-3.5 px-5">Trạng thái</th>
              <th className="py-3.5 px-5 text-right">Khóa / Mở khóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-10 text-center text-slate-400 text-sm">
                  Không tìm thấy người dùng nào phù hợp.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-mono text-xs font-bold text-slate-400">
                    #{user.id}
                  </td>
                  <td className="py-4 px-5">
                    <div>
                      <span className="font-bold text-slate-800 block">{user.name}</span>
                      <span className="text-xs text-slate-400">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      user.role === 'Admin' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-semibold text-slate-700">
                    {user.scansCount} ảnh
                  </td>
                  <td className="py-4 px-5 font-semibold text-slate-700">
                    {user.wishlistCount} mục
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-500">
                    {user.joinedDate}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      user.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {user.status === 'Active' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                      <span>{user.status === 'Active' ? 'Hoạt động' : 'Đã khóa'}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    {user.role !== 'Admin' ? (
                      <button
                        onClick={() => onToggleUserBan(user.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                          user.status === 'Active'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                        }`}
                      >
                        {user.status === 'Active' ? (
                          <>
                            <Lock size={13} />
                            <span>Khóa tài khoản</span>
                          </>
                        ) : (
                          <>
                            <Unlock size={13} />
                            <span>Mở khóa</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic font-medium">Admin Tối Cao</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTab;
