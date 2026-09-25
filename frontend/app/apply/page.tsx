"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/core/api";

type Job = { id: string; title: string; status: "DRAFT" | "PUBLISHED" | "CLOSED" | "OPEN"; jobCode?: string; department?: string };

export default function ApplyJobPage() {
  const [name, setName] = useState(""); // Quản lý state của Họ và tên
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobId, setJobId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    apiFetch<Job[]>("/api/jobs")
      .then((availableJobs) => {
        const publishedJobs = availableJobs.filter((job) => job.status === "PUBLISHED" || job.status === "OPEN");
        setJobs(publishedJobs);
        const requestedJobId = new URLSearchParams(window.location.search).get("jobId");
        setJobId(publishedJobs.some((job) => job.id === requestedJobId) ? requestedJobId! : publishedJobs[0]?.id || "");
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải danh sách job"));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError("");
    
    if (selectedFile) {
      // Validate NFR: Chỉ nhận PDF/DOCX (Phòng hờ nếu user cố tình kéo thả file sai)
      const fileName = selectedFile.name.toLowerCase();
      const isPdf = selectedFile.type === "application/pdf" || fileName.endsWith(".pdf");
      const isDocx = selectedFile.type.includes("wordprocessingml") || selectedFile.type.includes("msword") || fileName.endsWith(".doc") || fileName.endsWith(".docx");
      if (!isPdf && !isDocx) {
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
    const queryJobId = new URLSearchParams(window.location.search).get("jobId") || "";
    const selectedJobId = jobId || queryJobId || jobs[0]?.id || "";
    
    if (!name.trim()) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }
    
    if (!file) {
      setError("Vui lòng đính kèm CV của bạn.");
      return;
    }

    if (!selectedJobId) {
      setError("Hiện chưa có job đang mở để ứng tuyển.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("jobId", selectedJobId);
      formData.append("cv", file);
      await apiFetch("/api/applications", {
        method: "POST",
        body: formData,
      });
      setIsSubmitting(false);
      setError("");
      setName("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setError("Đã nộp hồ sơ thành công.");
      router.push("/applications");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể nộp hồ sơ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-[#1D4ED8] mb-2">Ứng tuyển</h2>
        <p className="text-gray-500 mb-8">Vui lòng điền thông tin và tải lên CV của bạn.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-[#DC2626] rounded-md border border-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí ứng tuyển <span className="text-red-500">*</span></label>
            <select required value={jobId} onChange={(event) => setJobId(event.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" disabled={jobs.length === 0}>
              {jobs.length === 0 ? <option value="">Đang tải job đang mở...</option> : jobs.map((job) => <option key={job.id} value={job.id}>{job.jobCode || `JOB-${job.id.slice(0, 6).toUpperCase()}`} - {job.title} - {job.department || "Chưa phân loại"}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      className="sr-only" 
                      onChange={handleFileChange} 
                      accept="application/pdf, .doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                    />
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