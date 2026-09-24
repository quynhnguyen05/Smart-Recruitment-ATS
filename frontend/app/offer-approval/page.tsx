"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function OfferApprovalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText === "XAC NHAN") {
      setIsModalOpen(false);
      setConfirmText("");
      router.push("/dashboard");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-surface-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tổng hợp đánh giá & Quyết định</h1>
      
      {/* Khối thông tin giả lập của ứng viên */}
      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-[#1D4ED8] mb-2">Ứng viên: Nguyễn Văn A</h2>
        <p className="text-gray-600 mb-4">Vị trí: Frontend Developer</p>
        <div className="flex gap-4 mb-6">
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md border border-green-200">
            <strong>Vòng 1:</strong> Pass (8.5/10)
          </div>
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md border border-green-200">
            <strong>Vòng 2:</strong> Pass (9.0/10)
          </div>
        </div>

        {/* Nút kích hoạt Modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1D4ED8] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition-colors"
        >
          Xác nhận tạo Offer
        </button>
      </div>

      {/* MODAL CẢNH BÁO (EXPLICIT CONFIRMATION) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            
            {/* Header Modal - Dùng màu Đỏ (Danger) cảnh báo */}
            <div className="bg-[#DC2626] px-6 py-4">
              <h3 className="text-lg font-bold text-white">Xác nhận quyết định (Không thể hoàn tác)</h3>
            </div>
            
            {/* Body Modal */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Bạn đang quyết định tạo Offer chính thức cho ứng viên này. Vui lòng xác nhận quyết định này dựa trên đánh giá thực tế của bạn, không hoàn toàn phụ thuộc vào AI.
              </p>
              
              <form onSubmit={handleConfirm}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gõ chữ <strong className="text-red-600">XAC NHAN</strong> vào ô bên dưới để tiếp tục:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="Nhập XAC NHAN..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6 uppercase"
                />
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={confirmText !== "XAC NHAN"}
                    className="px-4 py-2 text-white font-bold rounded-md transition-colors disabled:bg-red-300 bg-[#DC2626] hover:bg-red-700"
                  >
                    Chốt Offer
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}