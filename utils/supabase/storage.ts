import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export async function uploadSettingsIcon(
  supabase: SupabaseClient,
  file: File,
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const ext = file.name.split(".").pop();
    const filePath = `icon-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("settings")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("settings").getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading settings icon:", error);
    return { url: null, error: error as Error };
  }
}

export async function uploadGalleryImage(
  file: File,
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const supabase = createClient();

    // Generate a unique filename using timestamp and a random string
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { url: null, error: error as Error };
  }
}
