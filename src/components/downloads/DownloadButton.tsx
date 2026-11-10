import { useState } from "react";
import {
  AlertCircleIcon,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExternalIcon,
  FileIcon,
  ShieldIcon,
} from "@/components/Icons";
import {
  formatBytes,
  formatExactBytes,
  formatPlatformName,
  isPlaceholderSha256,
  resolveDriveLinks,
} from "@/services/versions.service";
import type { Download } from "@/types/versions";
import { cn } from "@/utils/cn";

export interface DownloadButtonProps {
  download: Download;
  compact?: boolean;
  className?: string;
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

export default function DownloadButton({
  download,
  compact = false,
  className,
}: DownloadButtonProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const driveLinks = resolveDriveLinks(download.url);
  const shaPlaceholder = isPlaceholderSha256(download.sha256);
  const verifyCommand =
    download.platform === "windows"
      ? `certutil -hashfile ${download.filename} SHA256`
      : `sha256sum ${download.filename}`;

  const handleCopyHash = async () => {
    await copyText(download.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 1600);
  };

  const handleCopyCmd = async () => {
    await copyText(verifyCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1600);
  };

  if (!driveLinks) {
    return (
      <div
        className={cn(
          "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800",
          className
        )}
      >
        <div className="flex items-start gap-2.5">
          <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">URL de download bloqueada por segurança</p>
            <p className="mt-1 text-xs text-red-700">
              O arquivo <code className="font-mono">{download.filename}</code> não possui um link HTTPS
              válido do Google Drive.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasPendingReleaseAsset = driveLinks.isPlaceholder || shaPlaceholder;

  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-700 ring-1 ring-zinc-200">
            <FileIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-semibold text-zinc-950">
              {download.filename}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-500">
              <span>{formatPlatformName(download.platform)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{download.architecture}</span>
              <span aria-hidden="true">·</span>
              <span title={formatExactBytes(download.size)} className="font-medium text-zinc-700">
                {formatBytes(download.size)}
              </span>
              <span className="text-zinc-400">({formatExactBytes(download.size)})</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={driveLinks.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !px-4 !py-2.5"
          >
            <DownloadIcon className="h-4 w-4" />
            {compact ? "Baixar" : "Baixar arquivo"}
          </a>
          <a
            href={driveLinks.shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !px-3.5 !py-2.5"
            title="Use esta opção se o download direto do Google Drive solicitar confirmação ou falhar"
          >
            Abrir no Google Drive
            <ExternalIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Verificação de integridade SHA-256 */}
      <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
            <ShieldIcon className="h-3.5 w-3.5 text-amber-600" />
            Integridade SHA-256
          </span>
          {!shaPlaceholder && (
            <button
              type="button"
              onClick={handleCopyHash}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              {copiedHash ? (
                <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <CopyIcon className="h-3.5 w-3.5" />
              )}
              {copiedHash ? "Hash copiado" : "Copiar hash"}
            </button>
          )}
        </div>

        <code className="mt-1.5 block break-all font-mono text-xs text-zinc-700">
          {download.sha256 || "Não informado"}
        </code>

        {!shaPlaceholder && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-2">
            <code className="font-mono text-[11px] text-zinc-500">
              $ {verifyCommand}
            </code>
            <button
              type="button"
              onClick={handleCopyCmd}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              {copiedCmd ? (
                <CheckIcon className="h-3 w-3 text-emerald-600" />
              ) : (
                <CopyIcon className="h-3 w-3" />
              )}
              {copiedCmd ? "Copiado" : "Copiar comando"}
            </button>
          </div>
        )}
      </div>

      {hasPendingReleaseAsset && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
          Entrada de modelo no manifesto: substitua{" "}
          {driveLinks.isPlaceholder && <code className="font-mono font-semibold">FILE_ID</code>}
          {driveLinks.isPlaceholder && shaPlaceholder && " e "}
          {shaPlaceholder && (
            <code className="font-mono font-semibold">REPLACE_WITH_REAL_SHA256</code>
          )}{" "}
          em <code className="font-mono">public/data/versions.json</code> após publicar os arquivos no
          Google Drive.
        </p>
      )}
    </div>
  );
}
