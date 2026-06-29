"use client";

import { updateSiteSettings } from "@/app/actions/settings";
import type { SiteSettings } from "@/utils/supabase/queries";
import { ImagePlus, Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";

interface SiteSettingsFormProps {
  settings: SiteSettings;
}

export default function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const [siteName, setSiteName] = useState(settings.site_name);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    settings.site_icon_url,
  );
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setIconFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const fd = new FormData();
    fd.set("site_name", siteName);
    if (iconFile) fd.set("site_icon", iconFile);

    startTransition(async () => {
      const result = await updateSiteSettings(fd);
      if ("error" in result) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Đã lưu cài đặt thành công" });
        setIconFile(null);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Icon */}
      <div className="card-feature p-6 space-y-4">
        <h2 className="text-base font-semibold text-stone-800">
          Biểu tượng trang
        </h2>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative size-20 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-amber-400 transition-all flex items-center justify-center overflow-hidden group"
            title="Chọn ảnh biểu tượng"
          >
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt="Site icon preview"
                  fill
                  className="object-contain p-1"
                  unoptimized={previewUrl.startsWith("blob:")}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                  <ImagePlus className="size-5 text-white" />
                </div>
              </>
            ) : (
              <ImagePlus className="size-6 text-stone-400 group-hover:text-amber-500 transition-colors" />
            )}
          </button>

          <div className="flex-1">
            <p className="text-sm text-stone-600">
              Nhấp vào ô bên trái để chọn ảnh biểu tượng mới.
            </p>
            <p className="text-xs text-stone-400 mt-1">
              PNG, JPG, SVG · Khuyến nghị 64×64 px trở lên
            </p>
            {iconFile && (
              <p className="text-xs text-amber-700 mt-1 font-medium">
                Đã chọn: {iconFile.name}
              </p>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleIconChange}
        />
      </div>

      {/* Site name */}
      <div className="card-feature p-6 space-y-3">
        <h2 className="text-base font-semibold text-stone-800">Tên trang</h2>
        <input
          type="text"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          placeholder="Gia Phả OS"
          maxLength={80}
          required
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition"
        />
        <p className="text-xs text-stone-400">
          Tên này hiển thị trên thanh điều hướng và tiêu đề trang.
        </p>
      </div>

      {/* Feedback */}
      {message && (
        <p
          className={`text-sm font-medium px-4 py-2.5 rounded-xl border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Lưu cài đặt
        </button>
      </div>
    </form>
  );
}
