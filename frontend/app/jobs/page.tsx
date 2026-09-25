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
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");


  const loadJobs = async () => {
    try {
      setJobs(await apiFetch<Job[]>("/api/jobs"));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải danh sách công việc");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    // Role is stored after login and is read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserRole(localStorage.getItem("role") || "");
    void loadJobs();
  }, []);


  const canManageJobs = userRole === "ADMIN" || userRole === "RECRUITER";


  const changeJobStatus = async (job: Job, status: Job["status"]) => {
    try {
      setError("");
      await apiFetch(`/api/jobs/${job.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await loadJobs();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Không thể cập nhật trạng thái Job");
    }
  };


  const saveJob = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingJob) return;
    try {
      await apiFetch(`/api/jobs/${editingJob.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: editTitle, description: editDescription, requirements: editDescription }),
      });
      setEditingJob(null);
      await loadJobs();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể cập nhật Job");
    }
  };


  return (
    <main className="min-h-screen p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">Recruitment workspace</p>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách công việc</h1>
            <p className="mt-2 text-gray-500">Theo dõi các vị trí đang tuyển dụng và trạng thái xử lý.</p>
          </div>
          {canManageJobs && <Link href="/create-job" className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800">Tạo công việc</Link>}
        </div>


        {error && <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
        {isLoading && <p className="text-gray-500">Đang tải danh sách công việc...</p>}
        {!isLoading && !error && jobs.length === 0 && <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">Chưa có công việc nào.</div>}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-4">
                <Link href={`/jobs/${job.id}`} className="text-xl font-semibold text-gray-900 hover:text-blue-700">{job.title}</Link>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${job.status === "PUBLISHED" ? "bg-green-100 text-green-800" : job.status === "CLOSED" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"}`}>{statusLabel[job.status]}</span>
              </div>
              <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-600">{job.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{job.applicantsCount} ứng viên</span>
                <Link href={`/jobs/${job.id}`} className="font-medium text-blue-700 hover:underline">Xem chi tiết →</Link>
              </div>
              {canManageJobs && <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4 text-sm">
                <button type="button" onClick={() => { setEditingJob(job); setEditTitle(job.title); setEditDescription(job.description); }} className="text-blue-700 hover:underline">Chỉnh sửa</button>
                {job.status !== "PUBLISHED" && <button type="button" onClick={() => void changeJobStatus(job, "PUBLISHED")} className="text-green-700 hover:underline">Publish</button>}
                {job.status !== "CLOSED" && <button type="button" onClick={() => void changeJobStatus(job, "CLOSED")} className="text-red-700 hover:underline">Close</button>}
                {job.status === "CLOSED" && <button type="button" onClick={() => void changeJobStatus(job, "DRAFT")} className="text-blue-700 hover:underline">Mở lại bản nháp</button>}
              </div>}
            </div>
          ))}
        </div>
      </div>


      {editingJob && <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
        <form onSubmit={saveJob} className="w-full max-w-lg space-y-4 rounded-lg bg-white p-6">
          <h2 className="text-xl font-bold">Cập nhật vị trí</h2>
          <input required value={editTitle} onChange={(event) => setEditTitle(event.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="Tên vị trí" />
          <textarea required rows={6} value={editDescription} onChange={(event) => setEditDescription(event.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="Mô tả và yêu cầu" />
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingJob(null)} className="rounded-md bg-gray-100 px-4 py-2">Hủy</button><button type="submit" className="rounded-md bg-blue-700 px-4 py-2 text-white">Lưu thay đổi</button></div>
        </form>
      </div>}
    </main>
  );
}





