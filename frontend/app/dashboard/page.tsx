"use client";

import JobCard from "@/components/JobCard";

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển (Dashboard)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-lg border-t-4 border-[#1D4ED8]">
          <h2 className="text-xl font-semibold">Công việc đang mở (OPEN)</h2>
          <p className="text-3xl font-bold mt-4 text-[#1D4ED8]">0</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg border-t-4 border-[#059669]">
          <h2 className="text-xl font-semibold">CV cần duyệt (SCREENING)</h2>
          <p className="text-3xl font-bold mt-4 text-[#059669]">0</p>
        </div>
      </div>
      {/* Danh sách Công việc (US-ATS-01) */}
     <div className="mt-10">
       <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách công việc tuyển dụng</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <JobCard 
           title="Frontend Developer (React/Next.js)"
           department="Engineering"
           location="Đà Nẵng"
           status="OPEN"
           applicantsCount={12}
         />
         <JobCard 
           title="Senior Business Analyst"
           department="Product"
           location="Hồ Chí Minh"
           status="OPEN"
           applicantsCount={5}
         />
         <JobCard 
           title="UX/UI Designer"
           department="Design"
           location="Hà Nội"
           status="DRAFT"
           applicantsCount={0}
         />
       </div>
     </div>
    </div>
  );
}