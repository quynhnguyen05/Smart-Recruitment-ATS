"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/core/api";

type Application = {
  id: string;
  status: string;
  appliedAt: string;
  job: { id: string; title: string; status: string };
};

const statusLabels: Record<string, string> = {
  NEW: "Đã nộp",
  SCORED: "Đã chấm điểm",
  SCREENING_PASSED: "Đạt vòng hồ sơ",
  REJECTED: "Không phù hợp",
  INTERVIEWING: "Đang phỏng vấn",
  OFFERED: "Đã có offer",
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<Application[]>("/api/applications")
      .then(setApplications)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải trạng thái hồ sơ"));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-3xl font-bold text-gray-900">Đơn ứng tuyển của tôi</h1><p className="text-gray-500 mt-1">Theo dõi trạng thái các vị trí đã ứng tuyển.</p></div>
          <button onClick={() => router.push("/dashboard")} className="text-blue-700 hover:underline">Về Dashboard</button>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
        <div className="space-y-4">
          {applications.length === 0 ? <div className="bg-white p-6 rounded-md border text-gray-500">Bạn chưa có đơn ứng tuyển nào.</div> : applications.map((application) => (
            <div key={application.id} className="bg-white p-6 rounded-md border border-gray-200 shadow-sm flex flex-wrap justify-between gap-4 items-center">
              <div><h2 className="text-lg font-bold text-gray-900">{application.job.title}</h2><p className="text-sm text-gray-500">Nộp ngày {new Date(application.appliedAt).toLocaleDateString("vi-VN")}</p></div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">{statusLabels[application.status] || application.status}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}