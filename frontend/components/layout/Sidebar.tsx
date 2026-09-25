"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  roles?: string[];
};

type NavGroup = {
  label: string;
  roles: string[];
  items: NavItem[];
  icon: LucideIcon;
};

const navGroups: NavGroup[] = [
  {
    label: "Tổng quan",
    roles: ["ADMIN", "RECRUITER", "CANDIDATE"],
    items: [{ href: "/dashboard", label: "Bảng điều khiển", roles: ["ADMIN", "RECRUITER", "CANDIDATE"] }],
    icon: LayoutDashboard,
  },
  {
    label: "Tuyển dụng",
    roles: ["ADMIN", "RECRUITER", "CANDIDATE"],
    items: [
      { href: "/jobs", label: "Danh sách công việc", roles: ["ADMIN", "RECRUITER"] },
      { href: "/create-job", label: "Tạo công việc", roles: ["ADMIN", "RECRUITER"] },
      { href: "/apply", label: "Ứng tuyển", roles: ["ADMIN"] },
      { href: "/applications", label: "Đơn ứng tuyển", roles: ["ADMIN", "RECRUITER"] },
    ],
    icon: BriefcaseBusiness,
  },
  {
    label: "Đơn ứng tuyển của tôi",
    roles: ["CANDIDATE"],
    items: [{ href: "/applications", label: "Trạng thái ứng tuyển", roles: ["CANDIDATE"] }],
    icon: FileText,
  },
  {
    label: "Hồ sơ ứng viên",
    roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER"],
    items: [
      { href: "/cv-review", label: "Duyệt hồ sơ", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER"] },
      { href: "/cv-summary", label: "Tóm tắt CV", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER"] },
    ],
    icon: FileText,
  },
  {
    label: "Phỏng vấn & đánh giá",
    roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"],
    items: [
      { href: "/schedule-interview", label: "Lịch phỏng vấn", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"] },
      { href: "/scorecard", label: "Scorecard", roles: ["ADMIN", "HIRING_MANAGER", "INTERVIEWER"] },
      { href: "/scorecard-summary", label: "Tổng hợp scorecard", roles: ["ADMIN", "HIRING_MANAGER"] },
    ],
    icon: ClipboardCheck,
  },
  {
    label: "Offer & quản trị",
    roles: ["ADMIN", "HIRING_MANAGER"],
    items: [
      { href: "/offer-approval", label: "Phê duyệt offer", roles: ["ADMIN", "HIRING_MANAGER"] },
      { href: "/admin-users", label: "Quản lý người dùng", roles: ["ADMIN"] },
    ],
    icon: ShieldCheck,
  },
];

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRole(localStorage.getItem("role") || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  const toggleGroup = (label: string) => {
    setOpenGroups((current) => ({ ...current, [label]: !current[label] }));
  };

  const canSee = (roles?: string[]) => role === "ADMIN" || !roles || roles.includes(role);
  const visibleGroups = navGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => canSee(item.roles)) }))
    .filter((group) => canSee(group.roles) && group.items.length > 0);

  return (
    <aside className={`group/sidebar relative w-full shrink-0 border-b border-slate-200 bg-slate-950 text-white transition-[width] duration-200 md:min-h-screen md:border-b-0 md:border-r md:border-slate-800 ${isCollapsed ? "md:w-20" : "md:w-[250px]"}`}>
      <div className="flex h-full flex-col md:sticky md:top-0 md:h-screen">
        <div className={`relative flex min-h-[88px] items-center border-b border-slate-800 ${isCollapsed ? "justify-center px-3" : "justify-between px-5"}`}>
          <Link href="/dashboard" aria-label="HireFlow AI - Bảng điều khiển" className="min-w-0 text-lg font-bold tracking-tight">
            {isCollapsed ? <span className="text-blue-400">HF</span> : <>HireFlow <span className="text-blue-400">AI</span></>}
            {!isCollapsed && <p className="mt-1 text-xs font-normal text-slate-400">Recruitment workspace</p>}
          </Link>
          <button
            type="button"
            onClick={() => setIsCollapsed((current) => !current)}
            aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-slate-800 hover:text-white ${isCollapsed ? "absolute right-1 top-2" : "ml-3"}`}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav aria-label="Điều hướng chính" className="flex gap-3 overflow-x-auto px-3 py-4 md:block md:flex-1 md:overflow-y-auto">
          {visibleGroups.map((group) => {
            const GroupIcon = group.icon;
            const groupIsActive = group.items.some((item) => isPathActive(pathname, item.href));
            const isOpen = openGroups[group.label] ?? groupIsActive;
            return (
              <section key={group.label} className="group/menu relative min-w-max md:mb-3 md:min-w-0">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  aria-expanded={isOpen}
                  title={isCollapsed ? group.label : undefined}
                  className={`flex w-full items-center rounded-md px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                    groupIsActive ? "text-blue-300" : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  } ${isCollapsed ? "justify-center" : "gap-3"}`}
                >
                  <GroupIcon size={18} aria-hidden="true" />
                  {!isCollapsed && <><span className="flex-1 truncate">{group.label}</span>{isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</>}
                </button>

                <div className={`${isCollapsed ? "invisible absolute left-full top-0 z-20 ml-2 w-56 -translate-x-2 rounded-lg border border-slate-700 bg-slate-900 p-2 opacity-0 shadow-xl transition-all group-hover/menu:visible group-hover/menu:translate-x-0 group-hover/menu:opacity-100" : isOpen ? "mt-1 space-y-1 border-l border-slate-800 pl-2" : "hidden"}`}>
                  {group.items.map((item) => {
                    const isActive = isPathActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                          isActive ? "bg-blue-600 font-medium text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </nav>

        <div className={`border-t border-slate-800 px-4 py-4 ${isCollapsed ? "flex flex-col items-center gap-3" : "flex items-center justify-between md:block"}`}>
          {!isCollapsed && <div className="min-w-0">
            <p className="truncate text-xs uppercase tracking-wider text-slate-500">Vai trò hiện tại</p>
            <p className="truncate text-sm font-medium text-slate-200">{role || "Đang tải..."}</p>
          </div>}
          {isCollapsed && <span title={role || "Đang tải..."} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-blue-300">{role.slice(0, 1) || "?"}</span>}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Đăng xuất"
            title="Đăng xuất"
            className={`rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white ${isCollapsed ? "flex h-9 w-9 items-center justify-center" : "px-3 py-2 md:mt-4 md:w-full md:text-left"}`}
          >
            {isCollapsed ? <LogOut size={18} /> : "Đăng xuất"}
          </button>
        </div>
      </div>
    </aside>
  );
}