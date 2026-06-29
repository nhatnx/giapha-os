"use server";

import { getIsAdmin, getSupabase } from "@/utils/supabase/queries";
import { uploadSettingsIcon } from "@/utils/supabase/storage";
import { revalidatePath } from "next/cache";

export type SettingsActionResult = { error: string } | { success: true };

export async function updateSiteSettings(
  formData: FormData,
): Promise<SettingsActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return { error: "Từ chối truy cập" };

  const supabase = await getSupabase();
  const siteName = (formData.get("site_name") as string | null)?.trim();
  const iconFile = formData.get("site_icon") as File | null;

  if (!siteName) return { error: "Tên trang không được để trống" };

  // Upload new icon if provided
  let iconUrl: string | undefined;
  if (iconFile && iconFile.size > 0) {
    if (!iconFile.type.startsWith("image/"))
      return { error: "Định dạng ảnh không hợp lệ" };

    const { url, error } = await uploadSettingsIcon(supabase, iconFile);
    if (error || !url) return { error: "Tải ảnh biểu tượng thất bại" };
    iconUrl = url;
  }

  const updates: { key: string; value: string | null }[] = [
    { key: "site_name", value: siteName },
  ];
  if (iconUrl !== undefined) {
    updates.push({ key: "site_icon_url", value: iconUrl });
  }

  for (const { key, value } of updates) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) return { error: "Lưu cài đặt thất bại: " + error.message };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}
