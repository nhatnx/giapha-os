import SiteSettingsForm from "@/components/SiteSettingsForm";
import { getIsAdmin, getSiteSettings } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";

export const metadata = { title: "Cài đặt trang" };

export default async function SettingsPage() {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) redirect("/dashboard");

  const settings = await getSiteSettings();

  return (
    <div className="flex-1 w-full relative flex flex-col pb-12">
      <div className="w-full relative z-20 py-6 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="title">Cài đặt trang</h1>
        <p className="text-stone-500 mt-1 text-sm">
          Tùy chỉnh tên và biểu tượng hiển thị trên toàn bộ trang web
        </p>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <SiteSettingsForm settings={settings} />
      </main>
    </div>
  );
}
