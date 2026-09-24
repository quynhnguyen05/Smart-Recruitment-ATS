"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface JobCardProps {
  title: string;
  department: string;
  location: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  applicantsCount: number;
  jobId: string;
}

export default function JobCard({ title, department, location, status, applicantsCount, jobId }: JobCardProps) {
  const router = useRouter();
  // Mapping màu sắc chuẩn Design Tokens (Output #16)
  const statusColors = {
    OPEN: 'bg-[#059669] text-white', 
    CLOSED: 'bg-[#DC2626] text-white',
    DRAFT: 'bg-gray-200 text-gray-800'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1D4ED8]">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{department} • {location}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-600">
          <strong className="text-gray-900">{applicantsCount}</strong> ứng viên
        </span>
        <button onClick={() => router.push(`/jobs/${jobId}`)} className="text-sm text-[#1D4ED8] font-medium hover:underline">
          Xem chi tiết →
        </button>
      </div>
    </div>
  );
}