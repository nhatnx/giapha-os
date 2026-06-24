"use client";

import { pluginRegistry } from "@/plugins";
import { useMemberListView } from "@/context/MemberListContext";
import { motion } from "framer-motion";
import { Circle, List, ListTree, Network } from "lucide-react";
import React from "react";

// String & {} preserves autocomplete for named values while allowing plugin-defined keys
export type ViewMode = "list" | "tree" | "mindmap" | "bubble" | (string & {});

type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const BUILTIN_TABS: Tab[] = [
  { id: "list", label: "Danh sách", icon: <List className="size-6 sm:size-4" /> },
  { id: "tree", label: "Sơ đồ cây", icon: <Network className="size-6 sm:size-4" /> },
  { id: "mindmap", label: "Mindmap", icon: <ListTree className="size-6 sm:size-4" /> },
  { id: "bubble", label: "Bong bóng", icon: <Circle className="size-6 sm:size-4" /> },
];

export default function ViewToggle() {
  const { view: currentView, setView } = useMemberListView();

  const pluginTabs: Tab[] = pluginRegistry.getTreeViews().map((p) => {
    const Icon = p.viewIcon;
    return {
      id: p.viewKey,
      label: p.viewLabel,
      icon: <Icon className="size-6 sm:size-4" />,
    };
  });

  const tabs = [...BUILTIN_TABS, ...pluginTabs];

  return (
    <div className="flex bg-stone-200/50 p-1.5 rounded-full shadow-inner w-fit mx-auto mt-4 mb-2 relative border border-stone-200/60 backdrop-blur-sm z-10">
      {tabs.map((tab) => {
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setView(tab.id as ViewMode)}
            className={`relative px-4 sm:px-6 py-1.5 sm:py-2.5 text-sm font-semibold rounded-full transition-colors duration-300 ease-in-out z-10 flex items-center gap-2 ${
              isActive ? "text-stone-900" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-full shadow-sm border border-stone-200/60 z-[-1]"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            <span
              className={`transition-colors duration-300 ${isActive ? "text-amber-700" : "text-stone-400"}`}
            >
              {tab.icon}
            </span>
            <span className="hidden sm:block tracking-wide">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
