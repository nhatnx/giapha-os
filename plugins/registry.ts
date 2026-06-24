import type {
  Plugin,
  DashboardPagePlugin,
  TreeViewPlugin,
  DataFormatPlugin,
  StatsWidgetPlugin,
} from "./types";

class PluginRegistry {
  private readonly plugins = new Map<string, Plugin>();

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.id)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[PluginRegistry] "${plugin.id}" is already registered — skipping.`);
      }
      return;
    }
    this.plugins.set(plugin.id, plugin);
  }

  unregister(id: string): void {
    this.plugins.delete(id);
  }

  getAll(): Plugin[] {
    return [...this.plugins.values()].filter((p) => p.enabled !== false);
  }

  getDashboardPages(): DashboardPagePlugin[] {
    return this.getAll().filter(
      (p): p is DashboardPagePlugin => p.type === "dashboard_page",
    );
  }

  getTreeViews(): TreeViewPlugin[] {
    return this.getAll().filter(
      (p): p is TreeViewPlugin => p.type === "tree_view",
    );
  }

  getDataFormats(): DataFormatPlugin[] {
    return this.getAll().filter(
      (p): p is DataFormatPlugin => p.type === "data_format",
    );
  }

  getStatsWidgets(): StatsWidgetPlugin[] {
    return this.getAll().filter(
      (p): p is StatsWidgetPlugin => p.type === "stats_widget",
    );
  }
}

// Module-level singleton — the same instance is used across all imports
// within a given environment (server process or browser tab).
export const pluginRegistry = new PluginRegistry();
