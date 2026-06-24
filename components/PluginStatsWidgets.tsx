"use client";

import { pluginRegistry } from "@/plugins";
import { Person, Relationship } from "@/types";

interface PluginStatsWidgetsProps {
  persons: Person[];
  relationships: Relationship[];
}

export default function PluginStatsWidgets({
  persons,
  relationships,
}: PluginStatsWidgetsProps) {
  const widgets = pluginRegistry.getStatsWidgets();
  if (widgets.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {widgets.map((widget) => {
        const Widget = widget.component;
        return (
          <div
            key={widget.id}
            className={widget.gridSpan === 2 ? "sm:col-span-2" : undefined}
          >
            <Widget persons={persons} relationships={relationships} />
          </div>
        );
      })}
    </div>
  );
}
