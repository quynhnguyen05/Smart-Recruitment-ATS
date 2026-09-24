"use client";
import React, { useState } from "react";

export default function CVSummaryPage() {
  const [viewMode, setViewMode] = useState<"AI" | "RAW">("AI");
  const [aiStatus, setAiStatus] = useState<"SUCCESS" | "ERROR">("SUCCESS");

  // Giả lập lỗi AI để test tính năng Fallback (US-ATS-03)
  const toggleAiError = () => {
    if (aiStatus === "SUCCESS") {
      setAiStatus("ERROR");
      setViewMode("RAW"); // Ép chuyển về xem CV gốc khi AI lỗi
    } else {
      setAiStatus("SUCCESS");
      setViewMode("AI");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chi tiết Hồ sơ: Nguyễn Văn A</h1>
            <p className="text-gray-500 mt-2">Vị trí: Frontend Developer</p>
          </div>
          
          {/* Nút dành cho Tester/Giám khảo giả lập lỗi AI */}
          <button 
            onClick={toggleAiError}
            className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
          >
            {aiStatus === "SUCCESS" ? "🛠 Giả lập AI lỗi (Test Fallback)" : "Khôi phục AI"}
          </button>
        </div>

        {/* Thanh Toggle chuyển đổi chế độ xem */}
        <div className="bg-white p-2 rounded-t-lg border-b border-gray-200 flex gap-2">
          <button
            onClick={() => setViewMode("AI")}
            disabled={aiStatus === "ERROR"}
            className={`px-4 py-2 text-sm font-bold rounded-md flex gap-2 items-center transition ${
              viewMode === "AI" ? "bg-[#1D4ED8] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            } ${aiStatus === "ERROR" ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            ✨ Xem tóm tắt (AI)
          </button>
          <button
            onClick={() => setViewMode("RAW")}
            className={`px-4 py-2 text-sm font-bold rounded-md transition ${
              viewMode === "RAW" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            📄 Xem CV Gốc (PDF)
          </button>
        </div>

        {/* Khu vực hiển thị Nội dung */}
        <div className="bg-white p-8 rounded-b-lg shadow-sm border border-gray-200 border-t-0 min-h-[500px]">
          
          {/* Cảnh báo lỗi AI (US-ATS-03 Fallback) */}
          {aiStatus === "ERROR" && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-yellow-800 font-bold flex gap-2 items-center">
                ⚠️ Dịch vụ AI đang gián đoạn
              </h3>
              <p className="text-yellow-700 text-sm mt-1">
                Không thể tạo bản tóm tắt tự động lúc này. Hệ thống đã tự động chuyển sang chế độ hiển thị CV Gốc (Fallback) để không làm gián đoạn công việc của bạn.
              </p>
            </div>
          )}

          {/* Nội dung AI Summary (US-ATS-04) */}
          {viewMode === "AI" && aiStatus === "SUCCESS" && (
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
                ✨ Thông tin được trích xuất tự động bởi AI
              </div>
              
              <div>
                <h4 className="font-bold text-gray-800 border-b pb-2 mb-3">Kỹ năng cốt lõi (Skills)</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-100">ReactJS</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-100">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-100">TypeScript</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 border-b pb-2 mb-3">Kinh nghiệm (Experience)</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                  <li>2 năm kinh nghiệm làm Frontend Developer tại công ty ABC.</li>
                  <li>Phát triển thành công hệ thống quản lý nội bộ bằng React và Next.js.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Nội dung CV Gốc */}
          {viewMode === "RAW" && (
            <div className="w-full h-full min-h-[400px] bg-gray-100 border border-gray-300 border-dashed rounded-md flex items-center justify-center">
              <p className="text-gray-400 font-medium">[Khu vực hiển thị File PDF / Word nguyên bản]</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}