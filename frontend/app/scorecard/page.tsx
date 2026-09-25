"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/core/api";

type Interview = {
  application: { id: string; cvUrl: string; job: { title: string } };
  scheduledAt?: string;
};

type MatchResult = {
  status: string;
  matchScore: number | null;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
};

export default function ScorecardPage() {
  const [technicalScore, setTechnicalScore] = useState("");
  const [notes, setNotes] = useState("");
  const [interviewId, setInterviewId] = useState("");
  const [interview, setInterview] = useState<Interview | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [cvUrl, setCvUrl] = useState("");
  const [cvContentType, setCvContentType] = useState("");
  const [cvText, setCvText] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Query parameters are client-only and must be read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInterviewId(new URLSearchParams(window.location.search).get("interviewId") || "");
  }, []);

  useEffect(() => {
    if (!interviewId) return;
    const token = localStorage.getItem("token");
    apiFetch<Interview>(`/api/interviews/${interviewId}`)
      .then(async (interviewData) => {
        setInterview(interviewData);
        const applicationId = interviewData.application.id;
        const matchData = await apiFetch<MatchResult>(`/api/applications/${applicationId}/match`);
        setMatch(matchData);
        return fetch(`/api/applications/${applicationId}/cv`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      })
      .then(async (response) => {
        if (!response.ok) throw new Error("Không thể tải CV ứng viên");
        const contentType = response.headers.get("content-type") || "";
        setCvContentType(contentType);
        return response.blob().then((blob) => ({ blob, contentType }));
      })
      .then(({ blob, contentType }) => {
        setCvUrl(URL.createObjectURL(blob));
        if (contentType.startsWith("text/plain")) blob.text().then(setCvText);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu scorecard"));
  }, [interviewId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (!interviewId) throw new Error("Thiếu interviewId để lưu scorecard");
      await apiFetch(`/api/interviews/${interviewId}/scorecard`, {
        method: "POST",
        body: JSON.stringify({ score: Number(technicalScore), notes }),
      });
      setSuccessMessage("Đã lưu đánh giá thành công!");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Không thể lưu scorecard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      {!interviewId ? (
        <div className="flex w-full items-center justify-center">
          <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Chưa chọn lịch phỏng vấn</h2>
            <p className="text-gray-600 mb-6">Vui lòng quay lại danh sách Lịch phỏng vấn của bạn để chọn một ứng viên cần đánh giá.</p>
            <button onClick={() => router.push("/my-interviews")} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
              Đến Lịch phỏng vấn của tôi
            </button>
          </div>
        </div>
      ) : (
        <>
      
      {/* CỘT TRÁI: 60% - Xem CV Ứng viên */}
      <div className="w-[60%] bg-gray-100 border-r border-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-bold text-gray-700 mb-2">CV Ứng viên: {interview?.application.job.title || "Đang tải..."}</h2>
        <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-md flex items-center justify-center">
          {cvText ? <pre className="w-full h-full overflow-auto whitespace-pre-wrap p-6 text-sm text-gray-700">{cvText}</pre> : cvUrl && cvContentType === "application/pdf" ? <iframe src={cvUrl} title="CV ứng viên" className="w-full h-full" /> : cvUrl ? <div className="text-center p-6"><p className="text-gray-600 mb-4">File này không hỗ trợ xem trực tiếp.</p><a href={cvUrl} download className="px-4 py-2 bg-blue-700 text-white rounded-md">Tải CV xuống</a></div> : <p className="text-gray-400 font-medium">{error || "Đang tải CV..."}</p>}
        </div>
      </div>

      {/* CỘT PHẢI: 40% - Bảng Form chấm điểm */}
      <div className="w-[40%] bg-white p-6 overflow-y-auto shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảng đánh giá (Scorecard)</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
        {match && <div className={`mb-6 p-4 rounded-md border ${match.status === "OK" ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"}`}>
          <div className="flex items-center justify-between"><h3 className="font-semibold text-[#1D4ED8]">AI Match Score</h3><strong className="text-3xl">{match.matchScore === null ? "N/A" : `${match.matchScore}%`}</strong></div>
          <p className="text-sm text-gray-700 mt-2">{match.explanation}</p>
          <p className="text-sm text-green-700 mt-2"><strong>Phù hợp:</strong> {match.matchedSkills.join(", ") || "Không có"}</p>
          <p className="text-sm text-red-700 mt-1"><strong>Còn thiếu:</strong> {match.missingSkills.join(", ") || "Không có"}</p>
        </div>}

        {/* Khối Gợi ý từ AI (US-ATS-08) */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#1D4ED8]">✨ AI Gợi ý câu hỏi</h3>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Dựa trên JD & CV</span>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Câu hỏi nên tập trung vào các kỹ năng còn thiếu trong phần AI phân tích.</li>
            <li>Match score chỉ hỗ trợ quyết định, interviewer vẫn cần đánh giá thực tế.</li>
          </ul>
        </div>

        {/* Form chấm điểm chính */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điểm chuyên môn (1 - 10) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1" max="10"
              required
              value={technicalScore}
              onChange={(e) => setTechnicalScore(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none"
              placeholder="Nhập điểm..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú đánh giá <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none"
              placeholder="Nhận xét chi tiết về ứng viên..."
            ></textarea>
          </div>

          {(() => {
            const isFutureInterview = interview?.scheduledAt ? new Date(interview.scheduledAt) > new Date() : false;
            return (
              <button
                type="submit"
                disabled={isSubmitting || !interviewId || isFutureInterview}
                className={`w-full mt-4 text-white font-bold py-3 px-4 rounded-md transition-colors ${isFutureInterview ? "bg-gray-400 cursor-not-allowed" : "bg-[#1D4ED8] hover:bg-blue-800 disabled:bg-gray-400"}`}
              >
                {isSubmitting ? "Đang lưu..." : !interviewId ? "Đang tải vòng phỏng vấn..." : isFutureInterview ? "Chưa đến thời gian phỏng vấn" : "Lưu đánh giá (Submit)"}
              </button>
            );
          })()}
        </form>
      </div>
      
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{successMessage}</h3>
            <p className="text-sm text-gray-500 mb-6">Hệ thống đã ghi nhận điểm và nhận xét của bạn.</p>
            <button
              onClick={() => router.replace("/my-interviews")}
              className="w-full inline-flex justify-center rounded-md border border-transparent bg-[#1D4ED8] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-800 sm:text-sm"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}