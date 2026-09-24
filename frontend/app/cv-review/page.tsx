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

export default function CVReviewPage() {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [cvContentType, setCvContentType] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCvLoading, setIsCvLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    apiFetch<Application[]>("/api/applications")
      .then((items) => {
        setApplications(items);
        setSelectedId(items[0]?.id || "");
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải hồ sơ"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const application = applications.find((item) => item.id === selectedId);
    if (!application) return;
    // Loading state is intentionally synchronized with the selected application.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsCvLoading(true);
    const token = localStorage.getItem("token");
    fetch(`/api/applications/${application.id}/cv`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải file CV");
        setCvContentType(response.headers.get("content-type") || "");
        return response.blob();
      })
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        setCvUrl(objectUrl);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải file CV"))
      .finally(() => setIsCvLoading(false));
  }, [applications, selectedId]);

  const selectedApplication = applications.find((item) => item.id === selectedId);

  const updateStatus = async (status: "SCREENING_PASSED" | "REJECTED") => {
    if (!selectedApplication) return;
    try {
      await apiFetch(`/api/applications/${selectedApplication.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      router.push(status === "SCREENING_PASSED" ? `/schedule-interview?applicationId=${selectedApplication.id}` : "/dashboard");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Không thể cập nhật trạng thái hồ sơ");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* CỘT TRÁI: 60% Hiển thị CV gốc */}
      <div className="w-[60%] bg-gray-100 border-r border-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-bold text-gray-700 mb-2">CV Ứng viên</h2>
        {isLoading ? <p className="text-gray-500">Đang tải danh sách đơn...</p> : applications.length > 0 && <select value={selectedId} onChange={(event) => { setCvUrl(""); setCvContentType(""); setSelectedId(event.target.value); }} className="mb-2 border rounded-md p-2">
          {applications.map((application) => <option key={application.id} value={application.id}>{application.candidateEmail} - {application.job.title} - {application.status}</option>)}
        </select>}
        <div className="flex-1 bg-white border border-gray-300 shadow-sm rounded-md flex items-center justify-center">
          {isCvLoading ? <p className="text-gray-500">Đang tải CV...</p> : cvUrl && cvContentType === "application/pdf" ? <iframe src={cvUrl} title="CV ứng viên" className="w-full h-full" /> : cvUrl ? <div className="text-center p-6"><p className="text-gray-600 mb-4">File DOCX không hỗ trợ xem trực tiếp trong trình duyệt.</p><a href={cvUrl} download className="inline-block px-4 py-2 bg-blue-700 text-white rounded-md">Tải CV xuống</a></div> : <p className="text-gray-400 font-medium">{error || (applications.length === 0 ? "Chưa có đơn ứng tuyển" : "Chưa có file CV")}</p>}
        </div>
      </div>

      {/* CỘT PHẢI: 40% AI Summary & Quyết định */}
      <div className="w-[40%] bg-white p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Duyệt Hồ Sơ (Screening)</h2>
        {selectedApplication && <div className="mb-4 p-4 bg-gray-50 border rounded-md"><p><strong>Ứng viên:</strong> {selectedApplication.candidateEmail}</p><p><strong>Vị trí:</strong> {selectedApplication.job.title}</p><p><strong>File:</strong> {selectedApplication.cvUrl}</p></div>}
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

        {/* Khối Điểm AI (US-ATS-05) */}
        <div className="mb-6 p-5 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="font-bold text-green-800 text-lg">AI Match Score</h3>
            <p className="text-sm text-green-700 mt-1">Phù hợp cao với yêu cầu (JD)</p>
          </div>
          <div className="text-4xl font-extrabold text-green-600">92%</div>
        </div>

        {/* Khối AI Phân tích */}
        <div className="mb-8 p-4 border border-gray-200 rounded-md">
          <h4 className="font-semibold text-gray-800 mb-3">Phân tích kỹ năng:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">✅ <span><strong>Kỹ năng có:</strong> React, Tailwind, Phân tích nghiệp vụ.</span></li>
            <li className="flex gap-2">✅ <span><strong>Kinh nghiệm:</strong> Hệ thống quản lý, Đồ án ATS.</span></li>
            <li className="flex gap-2">⚠️ <span><strong>Cần hỏi thêm:</strong> Quy trình làm việc Agile/Scrum.</span></li>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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