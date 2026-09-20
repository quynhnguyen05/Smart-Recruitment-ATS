"use client";
import React, { useState } from "react";

export default function ScorecardPage() {
  const [technicalScore, setTechnicalScore] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đã nộp bản đánh giá (Scorecard) thành công! Form giờ sẽ chuyển sang Read-only.");
  };

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      
      {/* CỘT TRÁI: 60% - Xem CV Ứng viên */}
      <div className="w-[60%] bg-gray-100 border-r border-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-bold text-gray-700 mb-2">CV Ứng viên: Nguyễn Văn A</h2>
        {/* Khu vực mô phỏng hiển thị file PDF */}
        <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-md flex items-center justify-center">
          <p className="text-gray-400 font-medium">[Khu vực hiển thị File PDF của CV]</p>
        </div>
      </div>

      {/* CỘT PHẢI: 40% - Bảng Form chấm điểm */}
      <div className="w-[40%] bg-white p-6 overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảng đánh giá (Scorecard)</h2>

        {/* Khối Gợi ý từ AI (US-ATS-08) */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#1D4ED8]">✨ AI Gợi ý câu hỏi</h3>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Dựa trên JD & CV</span>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Ứng viên có ghi kinh nghiệm ReactJS, hãy hỏi sâu về Custom Hooks.</li>
            <li>Trong CV thiếu kỹ năng quản lý state (Redux), hãy kiểm tra phần này.</li>
          </ul>
        </div>

        {/* Form chấm điểm chính */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điểm chuyên môn (1 - 10) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1" max="10"
              required
              value={technicalScore}
              onChange={(e) => setTechnicalScore(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none"
              placeholder="Nhập điểm..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú đánh giá <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none"
              placeholder="Nhận xét chi tiết về ứng viên..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[#1D4ED8] hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            Lưu đánh giá (Submit)
          </button>
        </form>
      </div>
      
    </div>
  );
}