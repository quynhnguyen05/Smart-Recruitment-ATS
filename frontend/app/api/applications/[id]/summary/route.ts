import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = params.id;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hồ sơ (Missing applicationId)" },
        { status: 404 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const simulateError = searchParams.get("simulateError");

    if (simulateError === "true") {
      return NextResponse.json(
        {
          success: false,
          message: "Dịch vụ AI đang gián đoạn",
          fallbackToRaw: true,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        candidateName: "Nguyễn Văn A",
        jobTitle: "Frontend Developer",
        parsedData: {
          skills: ["ReactJS", "Tailwind CSS", "TypeScript"],
          experience: [
            "2 năm kinh nghiệm làm Frontend Developer tại công ty ABC.",
            "Phát triển thành công hệ thống quản lý nội bộ bằng React và Next.js.",
          ],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating CV summary:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi máy chủ nội bộ (Internal Server Error)" },
      { status: 500 }
    );
  }
}
