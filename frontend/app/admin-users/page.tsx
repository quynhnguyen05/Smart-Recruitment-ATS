"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/core/api";

type User = {
  id: string;
  email: string;
  role: string;
  disabled: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "RECRUITER" });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadUsers = async () => {
    try {
      setError("");
      setUsers(await apiFetch<User[]>("/api/admin/users"));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải danh sách user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetching server state is the purpose of this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUsers();
  }, []);

  const handleDelete = async (user: User) => {
    if (!confirm("Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?")) return;

    try {
      await apiFetch<User>(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ disabled: true }),
      });
      await loadUsers();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Không thể vô hiệu hóa user");
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await apiFetch<User>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      setNewUser({ email: "", password: "", role: "RECRUITER" });
      setIsModalOpen(false);
      await loadUsers();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Không thể tạo user");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-red-100 text-red-800";
      case "RECRUITER": return "bg-blue-100 text-blue-800";
      case "INTERVIEWER": return "bg-green-100 text-green-800";
      case "HIRING_MANAGER": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Tài khoản (Admin Only)</h1>
            <p className="text-gray-500 text-sm mt-1">Phân quyền hệ thống: Admin, Recruiter, Interviewer, Hiring Manager</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1D4ED8] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors"
          >
            + Cấp quyền User mới
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân sự</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phân quyền (Role)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Đang tải...</td></tr> : users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${!user.disabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                      {user.disabled ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!user.disabled && user.role !== 'ADMIN' && (
                      <button onClick={() => void handleDelete(user)} className="text-red-600 hover:text-red-900">
                        Khóa (Deactivate)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-lg font-bold mb-4">Cấp quyền User mới</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <input required type="email" placeholder="Email" value={newUser.email} onChange={(event) => setNewUser({ ...newUser, email: event.target.value })} className="w-full px-3 py-2 border rounded-md" />
                <input required minLength={6} type="password" placeholder="Mật khẩu (tối thiểu 6 ký tự)" value={newUser.password} onChange={(event) => setNewUser({ ...newUser, password: event.target.value })} className="w-full px-3 py-2 border rounded-md" />
                <select value={newUser.role} onChange={(event) => setNewUser({ ...newUser, role: event.target.value })} className="w-full px-3 py-2 border rounded-md">
                  <option value="ADMIN">ADMIN</option><option value="RECRUITER">RECRUITER</option><option value="INTERVIEWER">INTERVIEWER</option><option value="HIRING_MANAGER">HIRING_MANAGER</option><option value="CANDIDATE">CANDIDATE</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded-md font-medium text-gray-700">Đóng</button>
                  <button type="submit" className="bg-[#1D4ED8] text-white px-4 py-2 rounded-md font-medium">Tạo user</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}