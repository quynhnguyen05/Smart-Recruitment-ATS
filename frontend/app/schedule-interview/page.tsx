"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/core/api";

type Interviewer = { id: string; email: string; role?: string };
type Application = { id: string; candidateEmail: string; job: { title: string }; status: string };

function getTodayDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function ScheduleInterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestedApplicationId = searchParams.get("applicationId") || "";
  const [round, setRound] = useState("1");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationId, setApplicationId] = useState(requestedApplicationId);

  useEffect(() => {
    Promise.all([apiFetch<Interviewer[]>("/api/interviewers"), apiFetch<Application[]>("/api/applications")])
      .then(([availableInterviewers, availableApplications]) => {
        const filteredInterviewers = availableInterviewers.filter((item) => item.role === "INTERVIEWER" || item.role === "HIRING_MANAGER");
        setInterviewers(filteredInterviewers);

        const passedApps = availableApplications.filter((item) => item.status === "SCREENING_PASSED");
        setApplications(passedApps);

        if (requestedApplicationId) {
          const selected = passedApps.find((item) => item.id === requestedApplicationId);
          if (selected) setApplicationId(selected.id);
          else setError("Hồ sơ ứng viên được chọn không hợp lệ hoặc chưa qua vòng duyệt CV (SCREENING_PASSED).");
        }
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu lịch phỏng vấn"))
      .finally(() => setIsLoading(false));
  }, [requestedApplicationId]);

  const selectedApplication = applications.find((item) => item.id === applicationId);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      if (!applicationId) throw new Error("Vui lòng chọn hồ sơ ứng viên");
      const interview = await apiFetch<{ id: string }>("/api/interviews", {
        method: "POST",
        body: JSON.stringify({
          applicationId,
          round: Number(round),
          date,
          time,
          interviewerId: interviewer,
          scheduledAt: new Date(`${date}T${time}:00`).toISOString()
        }),
      });
      setDate("");
      setTime("");
      setInterviewer("");
      setRound("1");
      setApplicationId("");
      setSuccessMessage("Đã chốt lịch thành công!");
      if (requestedApplicationId) {
        router.replace("/schedule-interview");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể lên lịch phỏng vấn");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-bold text-gray-900">Lên lịch phỏng vấn</h2>
          <p className="mt-2 text-gray-500">Ứng viên: <strong className="text-[#1D4ED8]">{selectedApplication?.candidateEmail || "Đang tải..."}</strong> ({selectedApplication?.job.title || "Đang tải vị trí..."})</p>
        </div>

        {error && <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-[#DC2626]">{error}</div>}
        {successMessage && <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">{successMessage}</div>}
        {isLoading && <p className="mb-6 text-gray-500">Đang tải dữ liệu...</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Hồ sơ ứng viên <span className="text-red-500">*</span></label>
            <select required value={applicationId} onChange={(event) => setApplicationId(event.target.value)} disabled={Boolean(requestedApplicationId) || isLoading} className="w-full rounded-md border border-gray-300 px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500">
              <option value="">Chọn hồ sơ cần phỏng vấn...</option>
              {applications.map((application) => <option key={application.id} value={application.id}>{application.candidateEmail} - {application.job.title} ({application.status})</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Vòng phỏng vấn <span className="text-red-500">*</span></label>
            <select required value={round} onChange={(event) => setRound(event.target.value)} className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#1D4ED8] focus:ring-[#1D4ED8]">
              <option value="1">Vòng 1 (Technical)</option>
              <option value="2">Vòng 2 (Culture/HR)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Ngày phỏng vấn <span className="text-red-500">*</span></label>
              <input type="date" required min={getTodayDate()} value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#1D4ED8] focus:ring-[#1D4ED8]" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Giờ phỏng vấn <span className="text-red-500">*</span></label>
              <input type="time" required value={time} onChange={(event) => setTime(event.target.value)} className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#1D4ED8] focus:ring-[#1D4ED8]" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Người phỏng vấn (Interviewer) <span className="text-red-500">*</span></label>
            <select required value={interviewer} onChange={(event) => setInterviewer(event.target.value)} className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#1D4ED8] focus:ring-[#1D4ED8]">
              <option value="">Chọn người phỏng vấn...</option>
              {interviewers.map((item) => <option key={item.id} value={item.id}>{item.email} ({item.role})</option>)}
            </select>
          </div>
          <button type="submit" disabled={isLoading || isSubmitting || !selectedApplication} className="w-full rounded-md bg-[#059669] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-green-700 disabled:bg-gray-400">
            {isSubmitting ? "Đang kiểm tra lịch trống..." : "Chốt lịch & Gửi thông báo"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ScheduleInterviewPage() {
  return <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">Đang tải dữ liệu...</main>}><ScheduleInterviewContent /></Suspense>;
}
