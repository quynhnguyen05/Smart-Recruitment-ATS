"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/core/api";

type Job = {
  id: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  applicantsCount: number;
};

const statusLabel: Record<Job["status"], string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đang tuyển",
  CLOSED: "Đã đóng",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<Job[]>("/api/jobs")
      .then(setJobs)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải danh sách công việc"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">Recruitment workspace</p>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách công việc</h1>
            <p className="mt-2 text-gray-500">Theo dõi các vị trí đang tuyển dụng và trạng thái xử lý.</p>
          </div>
          <Link href="/create-job" className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
            Tạo công việc
          </Link>
        </div>

        {error && <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
        {isLoading && <p className="text-gray-500">Đang tải danh sách công việc...</p>}
        {!isLoading && !error && jobs.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            Chưa có công việc nào.
          </div>
        )}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${job.status === "PUBLISHED" ? "bg-green-100 text-green-800" : job.status === "CLOSED" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"}`}>
                  {statusLabel[job.status]}
                </span>
              </div>
              <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-600">{job.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{job.applicantsCount} ứng viên</span>
                <span className="font-medium text-blue-700">Xem chi tiết →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}