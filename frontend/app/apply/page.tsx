"use client";
import React, { useState, useRef } from "react";

export default function ApplyJobPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError("");
    
    if (selectedFile) {
      // Validate NFR: Chỉ nhận PDF/DOCX
      if (selectedFile.type !== "application/pdf" && 
          !selectedFile.type.includes("wordprocessingml")) {
        setError("Chỉ hỗ trợ định dạng PDF hoặc DOCX.");
        setFile(null);
        return;
      }
      // Giới hạn 5MB
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Dung lượng file không được vượt quá 5MB.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Vui lòng đính kèm CV của bạn.");
      return;
    }

    setIsSubmitting(true);
    
    // Giả lập gọi API Backend mất 3s để người dùng thấy thanh Loading
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Nộp CV thành công! AI đang tiến hành trích xuất dữ liệu.");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-[#1D4ED8] mb-2">Ứng tuyển: Frontend Developer</h2>
        <p className="text-gray-500 mb-8">Vui lòng điền thông tin và tải lên CV của bạn.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-[#DC2626] rounded-md border border-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tải lên CV (PDF, DOCX) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#1D4ED8] hover:text-blue-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#1D4ED8]">
                    <span>Tải file lên</span>
                    <input ref={fileInputRef} type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Tối đa 5MB</p>
              </div>
            </div>
            {file && (
              <p className="mt-2 text-sm text-[#059669] font-medium">Đã chọn: {file.name}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#1D4ED8] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D4ED8] disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Hệ thống AI đang phân tích CV...
              </span>
            ) : (
              "Nộp hồ sơ ứng tuyển"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}