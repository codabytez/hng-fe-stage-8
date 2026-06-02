"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCustomDataStore } from "@/store/custom-data-store";
import { useQueryActions } from "@/store/query-store";
import { useToast } from "@/components/shared/ToastContainer";
import {
  inferSchema,
  parseImportedData,
} from "@/lib/query-engine/schema-inferrer";

interface ImportDataModalProps {
  open: boolean;
  onClose: () => void;
}

export function ImportDataModal({ open, onClose }: ImportDataModalProps) {
  const addDataset = useCustomDataStore((s) => s.addDataset);
  const { setSchema } = useQueryActions();
  const { toast } = useToast();

  const [raw, setRaw] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Record<string, unknown>[] | null>(
    null,
  );

  const handleParse = useCallback(() => {
    setError("");
    try {
      const data = parseImportedData(raw);
      setPreview(data.slice(0, 3));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid data");
      setPreview(null);
    }
  }, [raw]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const datasetName = file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = parseImportedData(String(ev.target?.result ?? ""));
          const schema = inferSchema(datasetName, data);
          addDataset({ schema, data });
          setSchema(schema.id);
          toast({
            message: `"${datasetName}" imported`,
            description: `${data.length} records · ${schema.fields.length} fields detected`,
          });
          setRaw("");
          setName("");
          setPreview(null);
          setError("");
          onClose();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to read file");
        }
      };
      reader.readAsText(file);
    },
    [addDataset, setSchema, toast, onClose],
  );

  const handleImport = useCallback(() => {
    setError("");
    try {
      const data = parseImportedData(raw);
      const datasetName = name.trim() || "My Dataset";
      const schema = inferSchema(datasetName, data);
      addDataset({ schema, data });
      setSchema(schema.id);
      toast({
        message: `"${datasetName}" imported`,
        description: `${data.length} records · ${schema.fields.length} fields detected`,
      });
      setRaw("");
      setName("");
      setPreview(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import");
    }
  }, [raw, name, addDataset, setSchema, toast, onClose]);

  const previewCols = preview ? Object.keys(preview[0] ?? {}).slice(0, 5) : [];

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="border-border-default bg-bg-elevated max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            Import Your Data
          </DialogTitle>
        </DialogHeader>
        <p className="text-text-muted -mt-1 text-sm">
          Paste a JSON array or upload a{" "}
          <code className="text-text-secondary">.json</code> file. Field types
          are inferred automatically.
        </p>

        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dataset name (e.g. Users, Orders)"
          className="border-border-default bg-bg-surface text-text-primary placeholder:text-text-muted focus:border-border-focus w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
        />

        {/* Paste area */}
        <textarea
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setError("");
            setPreview(null);
          }}
          placeholder={`[\n  { "id": 1, "name": "Alice", "age": 30 },\n  { "id": 2, "name": "Bob",   "age": 25 }\n]`}
          rows={7}
          className="border-border-default bg-bg-surface text-text-primary placeholder:text-text-muted focus:border-border-focus w-full resize-none rounded-md border px-3 py-2 text-xs focus:outline-none"
        />

        {error && <p className="text-destructive -mt-1 text-xs">{error}</p>}

        {/* Preview table */}
        {preview && preview.length > 0 && (
          <div className="border-border-default overflow-x-auto rounded-md border">
            <table className="w-full text-xs">
              <thead className="bg-bg-surface">
                <tr>
                  {previewCols.map((col) => (
                    <th
                      key={col}
                      className="text-text-secondary px-3 py-1.5 text-left font-medium"
                    >
                      {col}
                    </th>
                  ))}
                  {Object.keys(preview[0]).length > 5 && (
                    <th className="text-text-muted px-3 py-1.5 text-left">
                      +{Object.keys(preview[0]).length - 5} more
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-border-subtle border-t">
                    {previewCols.map((col) => (
                      <td key={col} className="text-text-muted px-3 py-1.5">
                        {String(row[col] ?? "—").slice(0, 24)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <label className="border-border-default bg-bg-surface text-text-secondary hover:text-text-primary flex flex-1 cursor-pointer items-center justify-center rounded-md border py-2 text-sm transition-colors">
            Upload .json
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>
          <button
            onClick={handleParse}
            disabled={!raw.trim()}
            className="border-border-default bg-bg-surface text-text-secondary hover:text-text-primary flex flex-1 items-center justify-center rounded-md border py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            Preview
          </button>
          <button
            onClick={handleImport}
            disabled={!raw.trim()}
            className="bg-accent hover:bg-accent-hover flex flex-1 items-center justify-center rounded-md py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            Import & Query
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
