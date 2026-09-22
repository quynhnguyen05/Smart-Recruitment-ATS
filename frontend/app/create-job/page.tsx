"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: "", department: "", location: "", description: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError("Tiêu đề và Mô tả công việc không được để trống.");
      return;
    }
    
    alert("Đã tạo Job Posting thành công (Trạng thái: DRAFT)");
    router.push("/dashboard");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-surface-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tạo tin tuyển dụng mới</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-sm border border-gray-200 space-y-6">
        {error && <div className="p-3 bg-red-50 text-[#DC2626] rounded-md text-sm border border-red-200">{error}</div>}
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề công việc <span className="text-red-500">*</span></label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1D4ED8] focus:border-[#1D4ED8]" placeholder="VD: Senior React Developer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
            <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1D4ED8] focus:border-[#1D4ED8]">
              <option value="">Chọn phòng ban...</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả và Yêu cầu (JD) <span className="text-red-500">*</span></label>
          <textarea rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1D4ED8] focus:border-[#1D4ED8]" placeholder="Nhập mô tả chi tiết công việc để hệ thống AI lấy làm cơ sở so sánh Match Score..." />
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
          <button type="button" onClick={() => router.push("/dashboard")} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">Hủy bỏ</button>
          <button type="submit" className="px-6 py-2 bg-[#1D4ED8] text-white font-bold rounded-md hover:bg-blue-800">Lưu bản nháp (DRAFT)</button>
        </div>
      </form>
    </div>
  );
}