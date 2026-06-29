import type React from "react";
import type { LucideIcon } from "lucide-react";
import type { Person, Relationship } from "@/types";

export type PluginType =
  | "dashboard_page"
  | "tree_view"
  | "data_format"
  | "stats_widget";

export interface TreeViewPluginProps {
  personsMap: Map<string, Person>;
  relationships: Relationship[];
  roots: Person[];
  canEdit: boolean;
}

export interface StatsWidgetPluginProps {
  persons: Person[];
  relationships: Relationship[];
}

export interface ImportResult {
  persons: Partial<Person>[];
  relationships: { type: string; person_a: string; person_b: string }[];
}

export interface ExportData {
  persons: Person[];
  relationships: Relationship[];
}

interface BasePlugin {
  id: string;
  name: string;
  description?: string;
  enabled?: boolean;
}

/**
 * Adds a new page to the dashboard with a navigation entry in HeaderMenu.
 * Create the actual page at app/dashboard/<path>/page.tsx as a standard Next.js route.
 */
export interface DashboardPagePlugin extends BasePlugin {
  type: "dashboard_page";
  /** Route path, e.g. "/dashboard/my-feature" */
  path: string;
  navLabel: string;
  navIcon: LucideIcon;
  /** If set, the nav item is only shown to users with this role or higher */
  requiredRole?: "admin" | "editor";
}

/**
 * Adds a new visualization mode to the members tree view.
 * The component receives the full persons map and relationships.
 */
export interface TreeViewPlugin extends BasePlugin {
  type: "tree_view";
  /** Unique key used in URL ?view=<viewKey> param */
  viewKey: string;
  viewLabel: string;
  viewIcon: LucideIcon;
  component: React.ComponentType<TreeViewPluginProps>;
}

/**
 * Adds a new data import/export format to the Data page.
 */
export interface DataFormatPlugin extends BasePlugin {
  type: "data_format";
  format: string;
  extensions: string[];
  importLabel?: string;
  exportLabel?: string;
  importer?: (file: File) => Promise<ImportResult>;
  exporter?: (data: ExportData) => Promise<Blob>;
}

/**
 * Adds a widget card to the Stats page.
 */
export interface StatsWidgetPlugin extends BasePlugin {
  type: "stats_widget";
  component: React.ComponentType<StatsWidgetPluginProps>;
  /** Column span in the stats grid (default: 1) */
  gridSpan?: 1 | 2;
}

export type Plugin =
  | DashboardPagePlugin
  | TreeViewPlugin
  | DataFormatPlugin
  | StatsWidgetPlugin;
