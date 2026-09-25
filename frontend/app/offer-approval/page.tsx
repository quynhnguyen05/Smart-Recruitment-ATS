"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/core/api";

type Application = {
  id: string;
  candidateEmail: string;
  job: { title: string };
  status: string;
};

type Offer = {
  id: string;
  applicationId?: string;
  salary: string;
  status: string;
};

function OfferApprovalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const applicationId = searchParams.get("applicationId") || "";
  const [application, setApplication] = useState<Application | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [salary, setSalary] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(applicationId));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!applicationId) {
      // Query params are resolved after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    Promise.all([apiFetch<Application[]>("/api/applications"), apiFetch<Offer[]>("/api/offers")])
      .then(([applications, offers]) => {
        const selectedApplication = applications.find((item) => item.id === applicationId) || null;
        setApplication(selectedApplication);
        setOffer(offers.find((item) => item.applicationId === applicationId) || null);
        if (!selectedApplication) setError("Không tìm thấy hồ sơ ứng viên được chọn.");
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu offer"))
      .finally(() => setIsLoading(false));
  }, [applicationId]);

  const createDraft = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const created = await apiFetch<Offer>("/api/offers", {
        method: "POST",
        body: JSON.stringify({ applicationId, salary: Number(salary) }),
      });
      setOffer(created);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Không thể tạo offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmOffer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!offer || confirmText !== "XAC NHAN") return;
    setIsSubmitting(true);
    try {
      const confirmedOffer = await apiFetch<Offer>(`/api/offers/${offer.id}/confirm`, {
        method: "PATCH",
        body: JSON.stringify({ confirmationToken: confirmText }),
      });
      setOffer({ ...offer, ...confirmedOffer, status: "CONFIRMED" });
      setIsModalOpen(false);
      setConfirmText("");
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : "Không thể xác nhận offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!applicationId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-50 p-6">
        <div className="w-full max-w-xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-gray-800">Chưa chọn ứng viên</h1>
          <p className="mb-6 text-gray-500">Vui lòng chọn một ứng viên từ trang Tổng hợp Scorecard để xem chi tiết đánh giá và tạo Offer</p>
          <button type="button" onClick={() => router.push("/scorecard-summary")} className="rounded-md bg-gray-700 px-5 py-2.5 font-medium text-white hover:bg-gray-800">
            Quay lại danh sách
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-50 p-5 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Tổng hợp đánh giá &amp; Quyết định</h1>
        {isLoading && <div className="rounded-md border border-gray-200 bg-white p-6 text-gray-500">Đang tải dữ liệu...</div>}
        {!isLoading && error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}
        {!isLoading && application && (
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold text-blue-700">{application.candidateEmail}</h2>
            <p className="mb-4 text-gray-600">Vị trí: {application.job.title}</p>
            <p className="mb-6">Trạng thái hồ sơ: <strong>{application.status}</strong></p>
            {!offer ? (
              <div className="flex flex-wrap items-end gap-3">
                <label className="flex-1 text-sm font-medium text-gray-700">Mức lương đề xuất
                  <input required type="number" min="1" value={salary} onChange={(event) => setSalary(event.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
                </label>
                <button type="button" disabled={isSubmitting} onClick={() => void createDraft()} className="rounded-md bg-blue-700 px-4 py-2 text-white disabled:bg-gray-300">{isSubmitting ? "Đang tạo..." : "Tạo Offer nháp"}</button>
              </div>
            ) : (
              <>
                <p className="mb-6">Offer: <strong>{offer.salary}</strong> - <span className="font-semibold">{offer.status}</span></p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    disabled={offer.status === "CONFIRMED" || isSubmitting}
                    className={`rounded-md px-6 py-2 ${offer.status === "CONFIRMED" ? "bg-gray-200 text-gray-500" : "bg-red-600 text-white hover:bg-red-700"} disabled:cursor-not-allowed`}
                  >
                    Xác nhận Offer
                  </button>
                  <button type="button" onClick={() => router.push("/scorecard-summary")} className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50">
                    Quay lại danh sách ứng viên
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <form onSubmit={confirmOffer} className="w-full max-w-md rounded-lg bg-white p-6">
          <h3 className="mb-3 text-lg font-bold">Human Confirmation</h3>
          <p className="mb-4 text-gray-700">Quyết định này cần được xác nhận bởi Hiring Manager hoặc Admin.</p>
          <input required value={confirmText} onChange={(event) => setConfirmText(event.target.value.toUpperCase())} placeholder="Gõ XAC NHAN" className="mb-4 w-full rounded-md border px-3 py-2" />
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md bg-gray-100 px-4 py-2">Hủy</button><button type="submit" disabled={confirmText !== "XAC NHAN" || isSubmitting} className="rounded-md bg-red-600 px-4 py-2 text-white disabled:bg-red-300">{isSubmitting ? "Đang xử lý..." : "Chốt Offer"}</button></div>
        </form>
      </div>}
    </main>
  );
}

export default function OfferApprovalPage() {
  return <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-surface-50 text-gray-500">Đang tải dữ liệu...</main>}><OfferApprovalContent /></Suspense>;
}
