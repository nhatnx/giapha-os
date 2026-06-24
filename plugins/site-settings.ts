import { Settings } from "lucide-react";
import type { DashboardPagePlugin } from "./types";

const siteSettingsPlugin: DashboardPagePlugin = {
  id: "site-settings",
  name: "Cài đặt trang",
  description: "Tùy chỉnh tên trang và biểu tượng",
  type: "dashboard_page",
  path: "/dashboard/settings",
  navLabel: "Cài đặt",
  navIcon: Settings,
  requiredRole: "admin",
};

export default siteSettingsPlugin;
