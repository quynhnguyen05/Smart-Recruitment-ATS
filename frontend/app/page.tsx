"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Mở ra khi cần chuyển trang

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Gọi API thật của Backend
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // Xử lý lỗi trả về từ Backend (400, 401)
      if (!res.ok) {
        setErrorMessage(data.error?.message || "Đã xảy ra lỗi đăng nhập.");
        setIsLoading(false);
        return;
      }

      // Xử lý thành công (200 OK)
      // Lưu token và role vào localStorage để dùng cho các request sau
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      if (data.role === 'CANDIDATE') {
        router.push('/jobs');
      } else if (data.role === 'INTERVIEWER') {
        router.push('/my-interviews');
      } else {
        router.push('/dashboard'); 
      }
      
      // router.push("/dashboard"); // Chuyển hướng người dùng sau khi xong UI nền
      
    } catch {
      setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-surface-50 p-4">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">HireFlow AI</h1>
          <p className="text-sm text-gray-500">Đăng nhập hệ thống quản lý tuyển dụng</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-danger text-sm rounded-md border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="recruiter@demo.com"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </main>
  );
}