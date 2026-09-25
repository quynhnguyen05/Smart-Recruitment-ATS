"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/core/api";

type ScorecardSummary = {
  id: string;
  candidateName: string;
  position: string;
  roundOneScore: number | null;
  roundTwoScore: number | null;
  average: number | null;
  status: string;
};

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ duyệt Offer", className: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Đã duyệt Offer", className: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
};

export default function ScorecardSummaryPage() {
  const [summaries, setSummaries] = useState<ScorecardSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<ScorecardSummary[]>("/api/scorecards/summary")
      .then(setSummaries)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải scorecard"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-5 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tổng hợp Điểm Phỏng Vấn</h1>
          <p className="mt-2 text-gray-500">Hiring Manager xem đánh giá thật trước khi tạo Offer.</p>
        </div>
        {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Ứng viên</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Vị trí</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Vòng 1</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Vòng 2</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Trung bình</th>
                <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase">Quyết định</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : summaries.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Chưa có dữ liệu scorecard.</td></tr>
              ) : summaries.map((summary) => {
                const isScored = summary.average !== null;
                const status = statusMap[summary.status] || { label: summary.status, className: "bg-gray-100 text-gray-700" };
                return (
                  <tr key={summary.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">{summary.candidateName}</td>
                    <td className="px-6 py-4 text-gray-600">{summary.position}</td>
                    <td className="px-6 py-4 text-gray-600">{summary.roundOneScore ?? "N/A"}</td>
                    <td className="px-6 py-4 text-gray-600">{summary.roundTwoScore ?? "N/A"}</td>
                    <td className={`px-6 py-4 font-bold ${isScored && summary.average! >= 8 ? "text-blue-700" : "text-gray-700"}`}>{summary.average ?? "N/A"}</td>
                    <td className="px-6 py-4 text-right">
                      {isScored ? (
                        <Link href={`/offer-approval?applicationId=${summary.id}`} className="inline-flex rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800">
                          {summary.status === "approved" ? "Xem chi tiết" : "Tạo Offer"}
                        </Link>
                      ) : (
                        <button type="button" disabled className="cursor-not-allowed rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-400">
                          Tạo Offer
                        </button>
                      )}
                      <span className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${status.className}`}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
