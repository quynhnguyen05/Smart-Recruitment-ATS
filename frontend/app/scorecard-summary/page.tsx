"use client";
import React from "react";

export default function ScorecardSummaryPage() {
  return (
    <div className="p-10 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tổng hợp Điểm Phỏng Vấn</h1>
        <p className="text-gray-500 mt-2">Dành cho Hiring Manager xem xét toàn bộ các vòng phỏng vấn</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ứng viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vòng 1 (Tech)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vòng 2 (Culture)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trung bình</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Lê Thị Quỳnh Như</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">8.5 (Pass)</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">9.0 (Pass)</td>
              <td className="px-6 py-4 whitespace-nowrap font-bold text-[#1D4ED8]">8.75</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">Chờ duyệt Offer</span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Trần Văn B</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">6.0 (Pass)</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">4.5 (Fail)</td>
              <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-700">5.25</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">Rejected</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}