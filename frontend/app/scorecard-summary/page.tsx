"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/core/api";

type Interview = { id: string; candidateEmail: string; application: { id: string; job: { title: string } }; scorecard: { score: number; notes: string | null } | null };

export default function ScorecardSummaryPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    apiFetch<Interview[]>("/api/interviews").then(setInterviews).catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải scorecard"));
  }, []);

  const grouped = interviews.reduce((result, interview) => {
    (result[interview.application.id] ||= []).push(interview);
    return result;
  }, {} as Record<string, Interview[]>);

  return <main className="p-10 max-w-6xl mx-auto bg-gray-50 min-h-screen"><div className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Tổng hợp Điểm Phỏng Vấn</h1><p className="text-gray-500 mt-2">Hiring Manager xem đánh giá thật trước khi tạo Offer.</p></div>{error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Ứng viên</th><th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Vị trí</th><th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Các vòng</th><th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Trung bình</th><th className="px-6 py-3 text-right text-xs text-gray-500 uppercase">Quyết định</th></tr></thead><tbody className="divide-y divide-gray-200">{Object.values(grouped).map((items) => { const first = items[0]; const scored = items.filter((item) => item.scorecard); const average = scored.length ? (scored.reduce((sum, item) => sum + (item.scorecard?.score || 0), 0) / scored.length).toFixed(1) : "N/A"; return <tr key={first.application.id}><td className="px-6 py-4 font-medium">{first.candidateEmail}</td><td className="px-6 py-4">{first.application.job.title}</td><td className="px-6 py-4">{items.map((item, index) => <div key={item.id}>Vòng {index + 1}: {item.scorecard ? `${item.scorecard.score}/10` : "Chưa chấm"}</div>)}</td><td className="px-6 py-4 font-bold text-blue-700">{average}</td><td className="px-6 py-4 text-right"><button disabled={!scored.length} onClick={() => router.push(`/offer-approval?applicationId=${first.application.id}`)} className="px-3 py-2 bg-blue-700 text-white rounded-md disabled:bg-gray-300">Tạo Offer</button></td></tr>; })}</tbody></table>{!Object.keys(grouped).length && <p className="p-6 text-gray-500">Chưa có vòng phỏng vấn hoặc scorecard.</p>}</div></main>;
}