import React from "react";
import { cn } from "@/lib/utils";

interface Token {
  type:
    | "keyword"
    | "field"
    | "operator"
    | "string"
    | "number"
    | "punctuation"
    | "comment"
    | "plain";
  text: string;
}

const SQL_KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "AND",
  "OR",
  "NOT",
  "IN",
  "LIKE",
  "BETWEEN",
  "IS",
  "NULL",
  "TRUE",
  "FALSE",
  "DATE",
  "MONTH",
  "YEAR",
  "NOW",
  "CURDATE",
  "YEARWEEK",
  "JSON_CONTAINS",
  "JSON_LENGTH",
  "REGEXP",
]);

function tokenizeSQL(code: string): Token[] {
  const tokens: Token[] = [];
  const parts = code.split(/(\s+|[(),]|'[^']*'|\b\w+\b)/g).filter(Boolean);
  for (const part of parts) {
    if (part.startsWith("'") && part.endsWith("'")) {
      tokens.push({ type: "string", text: part });
    } else if (part.startsWith("--")) {
      tokens.push({ type: "comment", text: part });
    } else if (SQL_KEYWORDS.has(part.toUpperCase())) {
      tokens.push({ type: "keyword", text: part.toUpperCase() });
    } else if (/^\d+(\.\d+)?$/.test(part)) {
      tokens.push({ type: "number", text: part });
    } else if (/^[(),*]$/.test(part)) {
      tokens.push({ type: "punctuation", text: part });
    } else if (/^[!=<>%]+$/.test(part)) {
      tokens.push({ type: "operator", text: part });
    } else if (/^\s+$/.test(part)) {
      tokens.push({ type: "plain", text: part });
    } else {
      tokens.push({ type: "field", text: part });
    }
  }
  return tokens;
}

function tokenizeJSON(code: string): Token[] {
  const tokens: Token[] = [];
  const regex =
    /("(?:[^"\\]|\\.)*")|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\],:])/g;
  let last = 0;
  let match;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > last)
      tokens.push({ type: "plain", text: code.slice(last, match.index) });
    if (match[1]) {
      const isKey =
        code[match.index - 1] === "\n" ||
        /^\s*$/.test(code.slice(0, match.index).split("\n").pop() ?? "");
      tokens.push({
        type:
          isKey &&
          code[match.index + match[0].length]?.trimStart().startsWith(":")
            ? "field"
            : "string",
        text: match[0],
      });
    } else if (match[2]) {
      tokens.push({
        type: match[2] === "null" ? "operator" : "keyword",
        text: match[0],
      });
    } else if (match[3]) {
      tokens.push({ type: "number", text: match[0] });
    } else if (match[4]) {
      tokens.push({ type: "punctuation", text: match[0] });
    }
    last = regex.lastIndex;
  }
  if (last < code.length)
    tokens.push({ type: "plain", text: code.slice(last) });
  return tokens;
}

function tokenizeGraphQL(code: string): Token[] {
  const GQL_KEYWORDS = new Set([
    "query",
    "mutation",
    "subscription",
    "fragment",
    "on",
    "where",
  ]);
  const tokens: Token[] = [];
  const parts = code
    .split(/(\s+|[{}()[\]:,]|"[^"]*"|#[^\n]*|\b\w+\b)/g)
    .filter(Boolean);
  for (const part of parts) {
    if (part.startsWith("#")) tokens.push({ type: "comment", text: part });
    else if (part.startsWith('"')) tokens.push({ type: "string", text: part });
    else if (GQL_KEYWORDS.has(part))
      tokens.push({ type: "keyword", text: part });
    else if (/^[{}()[\]:,]$/.test(part))
      tokens.push({ type: "punctuation", text: part });
    else if (/^\s+$/.test(part)) tokens.push({ type: "plain", text: part });
    else tokens.push({ type: "field", text: part });
  }
  return tokens;
}

const TYPE_CLASS: Record<Token["type"], string> = {
  keyword: "code-keyword",
  field: "code-field",
  operator: "code-operator",
  string: "code-string",
  number: "code-number",
  punctuation: "code-punctuation",
  comment: "code-comment",
  plain: "",
};

interface CodeBlockProps {
  code: string;
  language: "sql" | "json" | "graphql";
  className?: string;
}

export const CodeBlock = React.memo(function CodeBlock({
  code,
  language,
  className,
}: CodeBlockProps) {
  if (!code.trim()) {
    return (
      <pre
        className={cn(
          "border-code-border bg-code-bg min-h-50 rounded-md border p-4 font-mono text-sm leading-6",
          className,
        )}
      >
        <code className="code-comment">
          {`-- No conditions added yet\n-- Add rules above to generate a query`}
        </code>
      </pre>
    );
  }

  const tokens =
    language === "sql"
      ? tokenizeSQL(code)
      : language === "json"
        ? tokenizeJSON(code)
        : tokenizeGraphQL(code);

  return (
    <pre
      className={cn(
        "border-code-border bg-code-bg h-full overflow-auto rounded-md border p-4 font-mono text-sm leading-6",
        className,
      )}
    >
      <code>
        {tokens.map((token, i) =>
          token.type === "plain" ? (
            token.text
          ) : (
            <span key={i} className={TYPE_CLASS[token.type]}>
              {token.text}
            </span>
          ),
        )}
      </code>
    </pre>
  );
});
