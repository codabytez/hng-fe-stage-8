import { useMemo } from "react";
import { validateTree } from "@/lib/query-engine/validator";
import { getSchema } from "@/lib/schemas";
import { useQueryStore } from "@/store/query-store";
import type { ValidationResult } from "@/lib/query-engine/types";

export function useValidation(): ValidationResult & { getError: (id: string) => string | undefined } {
  const tree = useQueryStore((s) => s.tree);
  const schemaId = useQueryStore((s) => s.schemaId);

  const result = useMemo(() => {
    const schema = getSchema(schemaId);
    return validateTree(tree, schema);
  }, [tree, schemaId]);

  const errorMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of result.errors) map.set(e.conditionId, e.message);
    return map;
  }, [result.errors]);

  return {
    ...result,
    getError: (id: string) => errorMap.get(id),
  };
}
