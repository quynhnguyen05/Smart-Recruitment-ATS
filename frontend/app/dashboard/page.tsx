"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JobCard from "@/components/JobCard";
import { apiFetch } from "@/core/api";

type Job = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  applicantsCount: number;
};

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const router = useRouter();

  const changeJobStatus = async (job: Job, status: Job["status"]) => {
    try {
      await apiFetch(`/api/jobs/${job.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      const updatedJobs = await apiFetch<Job[]>("/api/jobs");
      setJobs(updatedJobs);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Không thể cập nhật trạng thái job");
    }
  };

  useEffect(() => {
    // These values intentionally become available after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    setRole(localStorage.getItem("role") || "");
    apiFetch<Job[]>("/api/jobs")
      .then(setJobs)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải danh sách công việc"))
      .finally(() => setIsLoading(false));
  }, []);

  const saveJob = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingJob) return;
    try {
      await apiFetch(`/api/jobs/${editingJob.id}`, { method: "PATCH", body: JSON.stringify({ title: editTitle, description: editDescription, requirements: editDescription }) });
      setEditingJob(null);
      const updatedJobs = await apiFetch<Job[]>("/api/jobs");
      setJobs(updatedJobs);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể cập nhật job");
    }
  };

  const openJobs = jobs.filter((job) => job.status === "PUBLISHED").length;
  const applicantCount = jobs.reduce((total, job) => total + job.applicantsCount, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển (Dashboard)</h1>
      <div className="mb-8 flex flex-wrap gap-3">
        {isMounted && role === "CANDIDATE" && <><button onClick={() => router.push("/apply")} className="px-4 py-2 bg-[#1D4ED8] text-white rounded-md">Tìm vị trí ứng tuyển</button><button onClick={() => router.push("/applications")} className="px-4 py-2 border border-blue-200 text-blue-700 rounded-md">Đơn ứng tuyển của tôi</button></>}
        {isMounted && (role === "ADMIN" || role === "RECRUITER") && <><button onClick={() => router.push("/create-job")} className="px-4 py-2 bg-[#1D4ED8] text-white rounded-md">Tạo vị trí mới</button><button onClick={() => router.push("/cv-review")} className="px-4 py-2 border border-blue-200 text-blue-700 rounded-md">Xem hồ sơ ứng tuyển</button><button onClick={() => router.push("/scorecard-summary")} className="px-4 py-2 border border-green-200 text-green-700 rounded-md">Tổng hợp scorecard</button></>}
        {isMounted && (role === "HIRING_MANAGER" || role === "INTERVIEWER") && <><button onClick={() => router.push("/schedule-interview")} className="px-4 py-2 bg-[#059669] text-white rounded-md">Lịch phỏng vấn</button><button onClick={() => router.push("/scorecard-summary")} className="px-4 py-2 border border-green-200 text-green-700 rounded-md">Tổng hợp scorecard</button></>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border-t-4 border-[#1D4ED8]">
          <h2 className="text-xl font-semibold">Công việc đang mở (OPEN)</h2>
          <p className="text-3xl font-bold mt-4 text-[#1D4ED8]">{openJobs}</p>
        </div>
        <button onClick={() => router.push("/cv-review")} className="p-6 bg-white shadow rounded-lg border-t-4 border-[#059669] text-left hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold">CV cần duyệt (SCREENING)</h2>
          <p className="text-3xl font-bold mt-4 text-[#059669]">{applicantCount}</p>
          <p className="text-sm text-blue-700 mt-2">Bấm để xem hồ sơ →</p>
        </button>
      </div>
      {/* Danh sách Công việc (US-ATS-01) */}
     <div className="mt-10">
       <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách công việc tuyển dụng</h2>
       {error && <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}
       {isLoading ? <p className="text-gray-500">Đang tải danh sách công việc...</p> : jobs.length === 0 ? <p className="text-gray-500">Chưa có job posting.</p> : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {jobs.map((job) => (
             <div key={job.id}>
               <JobCard
                 jobId={job.id}
                 title={job.title}
                 department="Chưa phân loại"
                 location="Chưa cập nhật"
                 status={job.status === "PUBLISHED" ? "OPEN" : job.status}
                 applicantsCount={job.applicantsCount}
               />
               <div className="mt-2 flex gap-2 text-sm">
                 {(role === "ADMIN" || role === "RECRUITER") && <button onClick={() => { setEditingJob(job); setEditTitle(job.title); setEditDescription(job.description); }} className="text-blue-700 hover:underline">Chỉnh sửa</button>}
                 {job.status !== "PUBLISHED" && <button onClick={() => void changeJobStatus(job, "PUBLISHED")} className="text-green-700 hover:underline">Publish</button>}
                 {job.status !== "CLOSED" && <button onClick={() => void changeJobStatus(job, "CLOSED")} className="text-red-700 hover:underline">Close</button>}
                 {job.status === "CLOSED" && <button onClick={() => void changeJobStatus(job, "DRAFT")} className="text-blue-700 hover:underline">Mở lại bản nháp</button>}
               </div>
             </div>
           ))}
         </div>
       )}
     </div>
     {editingJob && <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-10">
       <form onSubmit={saveJob} className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4">
         <h2 className="text-xl font-bold">Cập nhật vị trí</h2>
         <input required value={editTitle} onChange={(event) => setEditTitle(event.target.value)} className="w-full border rounded-md px-3 py-2" placeholder="Tên vị trí" />
         <textarea required rows={6} value={editDescription} onChange={(event) => setEditDescription(event.target.value)} className="w-full border rounded-md px-3 py-2" placeholder="Mô tả và yêu cầu" />
         <div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingJob(null)} className="px-4 py-2 bg-gray-100 rounded-md">Hủy</button><button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded-md">Lưu thay đổi</button></div>
       </form>
     </div>}
    </div>
  );
}