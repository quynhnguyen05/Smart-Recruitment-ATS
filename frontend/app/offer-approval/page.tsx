"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/core/api";

type Application = { id: string; candidateEmail: string; job: { title: string }; status: string };
type Offer = { id: string; applicationId?: string; salary: string; status: string };

export default function OfferApprovalPage() {
  const [applicationId, setApplicationId] = useState("");
  const [application, setApplication] = useState<Application | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [salary, setSalary] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("applicationId") || "";
    // Query parameters are client-only and are loaded after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApplicationId(id);
    if (!id) {
      setError("Thiếu applicationId để tạo offer");
      setIsLoading(false);
      return;
    }
    Promise.all([apiFetch<Application[]>("/api/applications"), apiFetch<Offer[]>("/api/offers")])
      .then(([applications, offers]) => {
        setApplication(applications.find((item) => item.id === id) || null);
        setOffer(offers.find((item) => item.applicationId === id) || null);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu offer"))
      .finally(() => setIsLoading(false));
  }, []);

  const createDraft = async () => {
    try {
      const created = await apiFetch<Offer>("/api/offers", { method: "POST", body: JSON.stringify({ applicationId, salary: Number(salary) }) });
      setOffer(created);
      setError("");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Không thể tạo offer");
    }
  };

  const confirmOffer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!offer || confirmText !== "XAC NHAN") return;
    try {
      await apiFetch(`/api/offers/${offer.id}`, { method: "PATCH", body: JSON.stringify({ status: "CONFIRMED" }) });
      router.replace("/dashboard");
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : "Không thể xác nhận offer");
    }
  };

  if (isLoading) return <main className="p-8">Đang tải quyết định offer...</main>;

  return (
    <main className="p-8 max-w-4xl mx-auto bg-surface-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tổng hợp đánh giá & Quyết định</h1>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
      {application && <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-blue-700 mb-2">{application.candidateEmail}</h2>
        <p className="text-gray-600 mb-4">Vị trí: {application.job.title}</p>
        <p className="mb-6">Trạng thái hồ sơ: <strong>{application.status}</strong></p>
        {!offer ? <div className="flex gap-3 items-end">
          <label className="flex-1 text-sm font-medium">Mức lương đề xuất
            <input required type="number" min="1" value={salary} onChange={(event) => setSalary(event.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
          </label>
          <button type="button" onClick={() => void createDraft()} className="px-4 py-2 bg-blue-700 text-white rounded-md">Tạo Offer nháp</button>
        </div> : <>
          <p className="mb-6">Offer: <strong>{offer.salary}</strong> - <span className="font-semibold">{offer.status}</span></p>
          <button type="button" onClick={() => setIsModalOpen(true)} disabled={offer.status === "CONFIRMED"} className="px-6 py-2 bg-red-600 text-white rounded-md disabled:bg-gray-300">Xác nhận Offer</button>
        </>}
      </div>}
      {isModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <form onSubmit={confirmOffer} className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-3">Human Confirmation</h3>
          <p className="text-gray-700 mb-4">Quyết định này cần được xác nhận bởi Hiring Manager hoặc Admin.</p>
          <input required value={confirmText} onChange={(event) => setConfirmText(event.target.value.toUpperCase())} placeholder="Gõ XAC NHAN" className="w-full border rounded-md px-3 py-2 mb-4" />
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-md">Hủy</button><button type="submit" disabled={confirmText !== "XAC NHAN"} className="px-4 py-2 bg-red-600 text-white rounded-md disabled:bg-red-300">Chốt Offer</button></div>
        </form>
      </div>}
    </main>
  );
}
