"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/core/api";

type Job = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  applicantsCount: number;
  createdAt: string;
};

const statusLabel: Record<Job["status"], string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đang tuyển",
  CLOSED: "Đã đóng",
};

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    apiFetch<Job>(`/api/jobs/${params.id}`)
      .then(setJob)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải thông tin công việc"))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) return <main className="p-8 max-w-4xl mx-auto">Đang tải thông tin công việc...</main>;
  if (error || !job) return <main className="p-8 max-w-4xl mx-auto"><div className="p-4 bg-red-50 text-red-700 rounded-md">{error || "Không tìm thấy công việc"}</div></main>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 text-sm text-blue-700 hover:underline">← Quay lại danh sách</button>
        <article className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Chi tiết vị trí tuyển dụng</p>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${job.status === "PUBLISHED" ? "bg-green-100 text-green-800" : job.status === "CLOSED" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"}`}>
              {statusLabel[job.status]}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-gray-100 text-sm">
            <div><span className="text-gray-500">Số ứng viên:</span> <strong>{job.applicantsCount}</strong></div>
            <div><span className="text-gray-500">Ngày đăng:</span> <strong>{new Date(job.createdAt).toLocaleDateString("vi-VN")}</strong></div>
          </div>

          <section className="py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Mô tả công việc</h2>
            <p className="whitespace-pre-wrap text-gray-700 leading-7">{job.description}</p>
          </section>
          <section className="pt-2">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Yêu cầu vị trí</h2>
            <p className="whitespace-pre-wrap text-gray-700 leading-7">{job.requirements}</p>
          </section>

          {job.status === "PUBLISHED" && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button onClick={() => router.push(`/apply?jobId=${job.id}`)} className="px-6 py-3 bg-[#1D4ED8] text-white font-bold rounded-md hover:bg-blue-800">
                Ứng tuyển vị trí này
              </button>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}