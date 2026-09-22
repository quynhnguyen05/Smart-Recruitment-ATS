"use client";
import React, { useState } from "react";

export default function AdminUsersPage() {
  // Giả lập dữ liệu danh sách user
  const [users, setUsers] = useState([
    { id: "U01", name: "Trần Admin", email: "admin@ats.com", role: "ADMIN", status: "Active" },
    { id: "U02", name: "Nguyễn Recruiter", email: "recruiter@ats.com", role: "RECRUITER", status: "Active" },
    { id: "U03", name: "Lê Interviewer", email: "interviewer@ats.com", role: "INTERVIEWER", status: "Active" },
    { id: "U04", name: "Phạm Hiring Manager", email: "hm@ats.com", role: "HIRING_MANAGER", status: "Inactive" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?")) {
      setUsers(users.map(u => u.id === id ? { ...u, status: "Inactive" } : u));
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

        {/* Bảng danh sách User */}
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.status === 'Active' && user.role !== 'ADMIN' && (
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                        Khóa (Deactivate)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal giả lập tạo User */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-lg font-bold mb-4">Cấp quyền User mới</h3>
              <p className="text-sm text-gray-500 mb-6">Tính năng đang được Backend hoàn thiện API...</p>
              <div className="flex justify-end">
                <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded-md font-medium text-gray-700">Đóng</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}