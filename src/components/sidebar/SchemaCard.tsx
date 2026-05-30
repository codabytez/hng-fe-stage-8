"use client";

import React from "react";
import { UserTag, Buildings, Flash } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { useQueryStore, useQueryActions } from "@/store/query-store";

const SCHEMAS = [
  { id: "agents", name: "Agents", Icon: UserTag, fields: 9, records: 87 },
  { id: "cities", name: "Cities", Icon: Buildings, fields: 10, records: 124 },
  { id: "incidents", name: "Incidents", Icon: Flash, fields: 9, records: 203 },
] as const;

export const SchemaCard = React.memo(function SchemaCard() {
  const schemaId = useQueryStore((s) => s.schemaId);
  const { setSchema } = useQueryActions();

  return (
    <div className="flex flex-col gap-1.5">
      {SCHEMAS.map((schema) => {
        const isActive = schemaId === schema.id;
        return (
          <button
            key={schema.id}
            onClick={() => setSchema(schema.id)}
            className={cn(
              "relative flex items-center justify-between rounded-md border px-3 py-2 text-left transition-all duration-150",
              isActive
                ? "border-accent bg-accent-subtle before:bg-accent before:absolute before:inset-y-0 before:left-0 before:w-0.75 before:rounded-l-md"
                : "border-border-default bg-bg-elevated hover:border-border-strong hover:bg-bg-hover",
            )}
          >
            <div className="flex items-center gap-2">
              <schema.Icon
                size={16}
                className={cn(isActive ? "text-accent" : "text-text-muted")}
                variant={isActive ? "Bold" : "Linear"}
              />
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-accent" : "text-text-primary",
                  )}
                >
                  {schema.name}
                </p>
                <p className="text-text-muted text-xs">
                  {schema.fields} fields
                </p>
              </div>
            </div>
            <span className="bg-bg-overlay text-text-muted rounded-sm px-1.5 py-0.5 text-xs">
              {schema.records}
            </span>
          </button>
        );
      })}
    </div>
  );
});
