"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/core/api";

type Interview = {
  id: string;
  scheduledAt: string;
  candidateEmail: string;
  interviewerId: string;
  scorecard?: any;
  application: {
    id: string;
    job: { title: string };
  };
};

export default function MyInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let currentUserId = "";
    let userRole = "";
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        currentUserId = payload.userId;
        userRole = payload.role;
      } catch (e) {
        console.error("Failed to parse token", e);
      }
    }

    apiFetch<Interview[]>("/api/interviews")
      .then((data) => {
        if (userRole === "INTERVIEWER") {
          setInterviews(data.filter((inv) => inv.interviewerId === currentUserId && !inv.scorecard));
        } else {
          setInterviews(data.filter((inv) => !inv.scorecard));
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Không thể tải danh sách phỏng vấn"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Lịch phỏng vấn của tôi</h1>
      <p className="text-gray-500 mb-8">Danh sách ứng viên bạn được phân công phỏng vấn.</p>
      
      {error && <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-md">{error}</div>}
      
      {isLoading ? (
        <p className="text-gray-500">Đang tải lịch phỏng vấn...</p>
      ) : interviews.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
          Hiện tại bạn chưa có lịch phỏng vấn nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => {
            const dt = new Date(interview.scheduledAt);
            const dateStr = dt.toLocaleDateString("vi-VN");
            const timeStr = dt.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={interview.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      Lịch hẹn
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {dateStr} {timeStr}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate" title={interview.candidateEmail}>
                    {interview.candidateEmail || "Ứng viên (Không rõ)"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 truncate">
                    Vị trí: {interview.application?.job?.title || "Không rõ"}
                  </p>
                </div>
                <button 
                  onClick={() => router.push(`/scorecard?interviewId=${interview.id}`)}
                  className="w-full py-2 bg-[#1D4ED8] hover:bg-blue-800 text-white text-sm font-semibold rounded-md transition-colors mt-auto"
                >
                  Vào chấm điểm (Scorecard)
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
