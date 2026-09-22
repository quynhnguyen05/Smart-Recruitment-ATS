"use client";
import React, { useState } from "react";

export default function CVReviewPage() {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* CỘT TRÁI: 60% Hiển thị CV gốc */}
      <div className="w-[60%] bg-gray-100 border-r border-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-bold text-gray-700 mb-2">CV Ứng viên: Lê Thị Quỳnh Như</h2>
        <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-md flex items-center justify-center">
          <p className="text-gray-400 font-medium">[Khu vực hiển thị File PDF của Ứng viên]</p>
        </div>
      </div>

      {/* CỘT PHẢI: 40% AI Summary & Quyết định */}
      <div className="w-[40%] bg-white p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Duyệt Hồ Sơ (Screening)</h2>

        {/* Khối Điểm AI (US-ATS-05) */}
        <div className="mb-6 p-5 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="font-bold text-green-800 text-lg">AI Match Score</h3>
            <p className="text-sm text-green-700 mt-1">Phù hợp cao với yêu cầu (JD)</p>
          </div>
          <div className="text-4xl font-extrabold text-green-600">92%</div>
        </div>

        {/* Khối AI Phân tích */}
        <div className="mb-8 p-4 border border-gray-200 rounded-md">
          <h4 className="font-semibold text-gray-800 mb-3">Phân tích kỹ năng:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">✅ <span><strong>Kỹ năng có:</strong> React, Tailwind, Phân tích nghiệp vụ.</span></li>
            <li className="flex gap-2">✅ <span><strong>Kinh nghiệm:</strong> Hệ thống quản lý, Đồ án ATS.</span></li>
            <li className="flex gap-2">⚠️ <span><strong>Cần hỏi thêm:</strong> Quy trình làm việc Agile/Scrum.</span></li>
          </ul>
        </div>

        {/* Nút Quyết định */}
        <div className="flex gap-4 border-t border-gray-100 pt-6">
          <button
            onClick={() => setIsRejectModalOpen(true)}
            className="flex-1 py-3 px-4 border border-red-200 text-red-700 font-bold rounded-md hover:bg-red-50 transition"
          >
            Từ chối (Reject)
          </button>
          <button
            onClick={() => alert("Đã chuyển ứng viên sang vòng Phỏng vấn!")}
            className="flex-1 py-3 px-4 bg-[#1D4ED8] text-white font-bold rounded-md hover:bg-blue-800 transition"
          >
            Đạt (Pass)
          </button>
        </div>
      </div>

      {/* Modal Xác nhận Từ chối */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold text-red-600 mb-2">Xác nhận Từ chối</h3>
            <p className="text-sm text-gray-600 mb-6">Bạn có chắc chắn muốn từ chối ứng viên này? Quyết định này sẽ được ghi vào Audit Log.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">Hủy</button>
              <button onClick={() => { alert("Đã ghi nhận Audit Log và Từ chối!"); setIsRejectModalOpen(false); }} className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}