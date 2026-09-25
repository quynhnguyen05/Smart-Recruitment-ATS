"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/core/api";

type Application = {
  id: string;
  cvUrl: string;
  candidateId: string;
  candidateEmail: string;
  status: string;
  job: { title: string };
};

type MatchResult = {
  status: string;
  matchScore: number | null;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
};

export default function CVReviewPage() {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [cvContentType, setCvContentType] = useState("");
  const [cvText, setCvText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCvLoading, setIsCvLoading] = useState(false);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<{ parsedData?: { skills: string[]; experience: string[] }; error?: string } | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const router = useRouter();

  const handleShowSummary = async () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    setShowSummary(true);
    if (!summaryData) {
      setIsSummaryLoading(true);
      try {
        const res = await fetch(`/api/applications/${selectedId}/summary`);
        const data = await res.json();
        if (data.success) {
          setSummaryData({ parsedData: data.parsedData });
        } else {
          setSummaryData({ error: data.message });
        }
      } catch (err) {
        setSummaryData({ error: "Lỗi kết nối tới AI Service" });
      } finally {
        setIsSummaryLoading(false);
      }
    }
  };

  useEffect(() => {
    apiFetch<Application[]>("/api/applications")
      .then((items) => {
        const newApps = items.filter(item => item.status === "NEW");
        setApplications(newApps);
        setSelectedId(newApps[0]?.id || "");
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải hồ sơ"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const application = applications.find((item) => item.id === selectedId);
    if (!application) return;
    setError("");
    // Loading state is intentionally synchronized with the selected application.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsCvLoading(true);
    apiFetch<MatchResult>(`/api/applications/${application.id}/match`)
      .then(setMatch)
      .catch(() => setMatch(null));
    const token = localStorage.getItem("token");
    fetch(`/api/applications/${application.id}/cv`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải file CV");
        const contentType = response.headers.get("content-type") || "";
        setCvContentType(contentType);
        return response.blob().then((blob) => ({ blob, contentType }));
      })
      .then(({ blob, contentType }) => {
        const objectUrl = URL.createObjectURL(blob);
        setCvUrl(objectUrl);
        if (contentType.startsWith("text/plain")) blob.text().then(setCvText);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải file CV"))
      .finally(() => setIsCvLoading(false));
  }, [applications, selectedId]);

  const selectedApplication = applications.find((item) => item.id === selectedId);

  const updateStatus = async (status: "SCREENING_PASSED" | "REJECTED") => {
    if (!selectedApplication) return;
    setError("");
    try {
      await apiFetch(`/api/applications/${selectedApplication.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      if (status === "SCREENING_PASSED") {
        router.push(`/schedule-interview?applicationId=${selectedApplication.id}`);
      } else {
        const remaining = applications.filter(app => app.id !== selectedApplication.id);
        setApplications(remaining);
        if (remaining.length > 0) {
          setSelectedId(remaining[0].id);
          setCvUrl(""); setCvContentType(""); setCvText(""); setMatch(null);
          setShowSummary(false); setSummaryData(null);
        } else {
          setSelectedId("");
          setCvUrl(""); setCvContentType(""); setCvText(""); setMatch(null);
          setShowSummary(false); setSummaryData(null);
        }
      }
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Không thể cập nhật trạng thái hồ sơ");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* CỘT TRÁI: 60% Hiển thị CV gốc hoặc Tóm tắt */}
      <div className="w-[60%] bg-gray-100 border-r border-gray-200 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-700">CV Ứng viên</h2>
          {selectedId && applications.length > 0 && (
            <button 
              onClick={handleShowSummary}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${showSummary ? 'bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`}
            >
              {showSummary ? 'Hoàn tác (Xem CV Gốc)' : '✨ Tóm tắt CV (AI)'}
            </button>
          )}
        </div>
        {isLoading ? <p className="text-gray-500 mb-2">Đang tải danh sách đơn...</p> : applications.length > 0 && <select value={selectedId} onChange={(event) => { setError(""); setCvUrl(""); setCvContentType(""); setCvText(""); setMatch(null); setShowSummary(false); setSummaryData(null); setSelectedId(event.target.value); }} className="mb-2 border rounded-md p-2">
          {applications.map((application) => <option key={application.id} value={application.id}>{application.candidateEmail} - {application.job.title} - {application.status}</option>)}
        </select>}
        <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-md flex flex-col overflow-hidden">
          {showSummary ? (
            <div className="p-8 h-full overflow-y-auto">
              {isSummaryLoading ? (
                <div className="flex items-center justify-center h-full text-gray-500">Đang tóm tắt CV bằng AI...</div>
              ) : summaryData?.error ? (
                <div className="text-red-500 bg-red-50 p-4 rounded-md">{summaryData.error}</div>
              ) : summaryData?.parsedData ? (
                <div className="space-y-6">
                  <div className="p-4 bg-purple-50 text-purple-700 rounded-md text-sm font-medium flex items-center gap-2">
                    ✨ Thông tin được trích xuất tự động bởi AI
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-3">Kỹ năng cốt lõi (Skills)</h3>
                    <div className="flex flex-wrap gap-2">
                      {summaryData.parsedData.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-3">Kinh nghiệm (Experience)</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm leading-relaxed">
                      {summaryData.parsedData.experience.map((exp, i) => (
                        <li key={i}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            isCvLoading ? <div className="flex items-center justify-center h-full"><p className="text-gray-500">Đang tải CV...</p></div> : cvText ? <pre className="w-full h-full overflow-auto whitespace-pre-wrap p-6 text-sm text-gray-700">{cvText}</pre> : cvUrl && cvContentType === "application/pdf" ? <iframe src={cvUrl} title="CV ứng viên" className="w-full h-full" /> : cvUrl ? <div className="text-center p-6 m-auto"><p className="text-gray-600 mb-4">File này không hỗ trợ xem trực tiếp trong trình duyệt.</p><a href={cvUrl} download className="inline-block px-4 py-2 bg-blue-700 text-white rounded-md">Tải CV xuống</a></div> : <div className="flex items-center justify-center h-full"><p className="text-gray-400 font-medium">{error || (applications.length === 0 ? "Chưa có đơn ứng tuyển" : "Chưa có file CV")}</p></div>
          )}
        </div>
      </div>

      {/* CỘT PHẢI: 40% AI Summary & Quyết định */}
      <div className="w-[40%] bg-white p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Duyệt Hồ Sơ (Screening)</h2>
        {selectedApplication && <div className="mb-4 p-4 bg-gray-50 border rounded-md"><p><strong>Ứng viên:</strong> {selectedApplication.candidateEmail}</p><p><strong>Vị trí:</strong> {selectedApplication.job.title}</p><p><strong>File:</strong> {selectedApplication.cvUrl}</p></div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

        {/* Khối Điểm AI (US-ATS-05) */}
        <div className="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="font-bold text-blue-800 text-lg">AI Match Score</h3>
            <p className="text-sm text-blue-700 mt-1">{match?.explanation || "Đang phân tích nội dung CV..."}</p>
          </div>
          <div className="text-4xl font-extrabold text-blue-700">{match?.matchScore === null || match?.matchScore === undefined ? "N/A" : `${match.matchScore}%`}</div>
        </div>

        {/* Khối AI Phân tích */}
        <div className="mb-8 p-4 border border-gray-200 rounded-md">
          <h4 className="font-semibold text-gray-800 mb-3">Phân tích kỹ năng:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">✅ <span><strong>Kỹ năng có:</strong> {match?.matchedSkills.join(", ") || "Chưa xác định"}</span></li>
            <li className="flex gap-2">⚠️ <span><strong>Cần hỏi thêm:</strong> {match?.missingSkills.join(", ") || "Không có dữ liệu thiếu"}</span></li>
          </ul>
        </div>

        {/* Nút Quyết định */}
        <div className="flex gap-4 border-t border-gray-100 pt-6">
          <button
            onClick={() => setIsRejectModalOpen(true)}
            className="flex-1 py-3 px-4 border border-red-200 text-red-700 font-bold rounded-md hover:bg-red-50 transition"
          >
            Từ chối (Reject)
          </button>
          <button
            onClick={() => void updateStatus("SCREENING_PASSED")}
            className="flex-1 py-3 px-4 bg-[#1D4ED8] text-white font-bold rounded-md hover:bg-blue-800 transition"
          >
            Đạt (Pass)
          </button>
        </div>
      </div>

      {/* Modal Xác nhận Từ chối */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold text-red-600 mb-2">Xác nhận Từ chối</h3>
            <p className="text-sm text-gray-600 mb-6">Bạn có chắc chắn muốn từ chối ứng viên này? Quyết định này sẽ được ghi vào Audit Log.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">Hủy</button>
              <button onClick={() => { setIsRejectModalOpen(false); void updateStatus("REJECTED"); }} className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}