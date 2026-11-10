import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { CheckIcon, CopyIcon } from "./Icons";

const KYN_KEYWORDS = new Set([
  "fn", "extern", "export", "struct", "enum", "let", "var", "return",
  "if", "else", "while", "break", "continue", "true", "false", "as",
  "const", "private", "import", "project", "target", "kind", "sources",
]);
const KYN_TYPES = new Set([
  "i8", "i16", "i32", "i64", "u8", "u16", "u32", "u64",
  "usize", "isize", "f32", "f64", "bool", "char", "void",
]);
const SH_WORDS = new Set([
  "git", "clone", "cd", "zig", "build", "kync", "run", "check", "wsl",
  "sudo", "apt", "install", "xcode-select", "brew", "test", "emit-llvm", "emit-obj",
]);

type Token = { text: string; cls: string };

function tokenizeKyn(code: string): Token[] {
  const tokens: Token[] = [];
  const re = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_][A-Za-z0-9_]*)\b/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index), cls: "text-zinc-400" });
    if (m[1]) tokens.push({ text: m[1], cls: "italic text-zinc-500" });
    else if (m[2]) tokens.push({ text: m[2], cls: "text-amber-300" });
    else if (m[3]) tokens.push({ text: m[3], cls: "text-orange-300" });
    else if (m[4]) {
      const w = m[4];
      if (KYN_KEYWORDS.has(w)) tokens.push({ text: w, cls: "text-violet-400" });
      else if (KYN_TYPES.has(w)) tokens.push({ text: w, cls: "text-sky-300" });
      else tokens.push({ text: w, cls: "text-zinc-100" });
    }
    last = re.lastIndex;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), cls: "text-zinc-400" });
  return tokens;
}

function tokenizeSh(code: string): Token[] {
  const tokens: Token[] = [];
  const re = /(#[^\n]*)|("(?:[^"\\]|\\.)*")|\b([A-Za-z0-9_./~:@+-][\w./~:@+-]*)\b/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index), cls: "text-zinc-400" });
    if (m[1]) tokens.push({ text: m[1], cls: "italic text-zinc-500" });
    else if (m[2]) tokens.push({ text: m[2], cls: "text-amber-300" });
    else if (m[3]) {
      const w = m[3];
      if (/^https?:/.test(w)) tokens.push({ text: w, cls: "text-sky-300 underline decoration-sky-300/30 underline-offset-2" });
      else if (SH_WORDS.has(w)) tokens.push({ text: w, cls: "text-violet-400" });
      else if (/^(\.?\/|--)/.test(w)) tokens.push({ text: w, cls: "text-emerald-300" });
      else tokens.push({ text: w, cls: "text-zinc-200" });
    }
    last = re.lastIndex;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), cls: "text-zinc-400" });
  return tokens;
}

export default function CodeBlock({
  code,
  lang = "kyn",
  title,
  className,
}: {
  code: string;
  lang?: "kyn" | "sh";
  title?: string;
  className?: string;
}) {
  const tokens = useMemo(() => (lang === "sh" ? tokenizeSh(code) : tokenizeKyn(code)), [code, lang]);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl shadow-zinc-900/10",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          </div>
          {title && <span className="truncate font-mono text-xs text-zinc-400">{title}</span>}
          {lang === "kyn" && !title && (
            <span className="font-mono text-xs text-zinc-500">.kyn</span>
          )}
        </div>
        <button
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
        >
          {copied ? (
            <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>
          {tokens.map((t, i) => (
            <span key={i} className={t.cls}>
              {t.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
