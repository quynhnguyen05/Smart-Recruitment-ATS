"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/core/api";

type Interviewer = { id: string; email: string };

export default function ScheduleInterviewPage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [applicationId] = useState(() => typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("applicationId") || "");
  const router = useRouter();

  useEffect(() => {
    apiFetch<Interviewer[]>("/api/interviewers")
      .then(setInterviewers)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải interviewer"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!applicationId) throw new Error("Thiếu applicationId để lên lịch phỏng vấn");
      const interview = await apiFetch<{ id: string }>("/api/interviews", {
        method: "POST",
        body: JSON.stringify({ applicationId, interviewerId: interviewer, scheduledAt: new Date(`${date}T${time}:00`).toISOString() }),
      });
      setDate("");
      setTime("");
      setInterviewer("");
      router.push(`/scorecard?interviewId=${interview.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể lên lịch phỏng vấn");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-bold text-gray-900">Lên lịch phỏng vấn</h2>
          <p className="text-gray-500 mt-2">Ứng viên: <strong className="text-[#1D4ED8]">Nguyễn Văn A</strong> (Frontend Developer)</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-[#DC2626] rounded-md border border-red-200 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày phỏng vấn <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ phỏng vấn <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Người phỏng vấn (Interviewer) <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={interviewer}
              onChange={(e) => setInterviewer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
            >
              <option value="">Chọn người phỏng vấn...</option>
              {interviewers.map((item) => <option key={item.id} value={item.id}>{item.email}</option>)}
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h4 className="text-sm font-bold text-blue-800 mb-1">Mẹo chọn lịch (AI Suggestion):</h4>
            <p className="text-sm text-blue-600">Dựa vào lịch trình, Interviewer Trần Văn B thường rảnh vào các buổi chiều thứ 3 và thứ 5.</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-md shadow-sm text-sm font-bold text-white bg-[#059669] hover:bg-green-700 focus:outline-none disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? "Đang kiểm tra lịch trống..." : "Chốt lịch & Gửi thông báo"}
          </button>
        </form>
      </div>
    </div>
  );
}