/**
 * Plugin system entry point.
 *
 * To add a plugin:
 * 1. Create a file in this directory (or anywhere in the project) that exports
 *    an object conforming to one of the Plugin types from ./types.
 * 2. Import and register it below.
 *
 * Example:
 *   import { myTreePlugin } from "./my-tree-plugin";
 *   pluginRegistry.register(myTreePlugin);
 *
 * Plugin types:
 *   - DashboardPagePlugin  → new route + nav item in the header menu
 *   - TreeViewPlugin       → new visualization mode on the members page
 *   - DataFormatPlugin     → new import/export format on the data page
 *   - StatsWidgetPlugin    → new widget card on the stats page
 */

export { pluginRegistry } from "./registry";

export type {
  Plugin,
  PluginType,
  DashboardPagePlugin,
  TreeViewPlugin,
  DataFormatPlugin,
  StatsWidgetPlugin,
  TreeViewPluginProps,
  StatsWidgetPluginProps,
  ImportResult,
  ExportData,
} from "./types";

// ── Register plugins here ──────────────────────────────────────────────────
// import { examplePlugin } from "./example-plugin";
// pluginRegistry.register(examplePlugin);
