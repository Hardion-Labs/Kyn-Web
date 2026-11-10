import type { ReactNode } from "react";

function S({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function F({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

export function KynLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 858 858" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 812.0,40.0 L 556.0,41.0 L 40.0,558.0 L 40.0,810.0 Z" />
      <path d="M 241.0,41.0 L 40.0,41.0 L 40.0,418.0 L 242.0,215.0 Z" />
      <path d="M 443.0,535.0 L 569.0,663.0 L 817.0,662.0 L 569.0,409.0 Z" />
      <path d="M 294.0,677.0 L 294.0,679.0 L 449.0,835.0 L 626.0,835.0 L 383.0,588.0 Z" />
    </svg>
  );
}

export function Zap({ className }: { className?: string }) {
  return (
    <F className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </F>
  );
}

export function GithubIcon({ className }: { className?: string }) {
  return (
    <F className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </F>
  );
}

export function WindowsIcon({ className }: { className?: string }) {
  return (
    <F className={className}>
      <path d="M3 5.6 10.6 4.5v6.9H3V5.6Zm8.6-1.3L21 3.2v8.2h-8.4V4.3ZM3 12.6h7.6v6.9L3 18.4v-5.8Zm8.6 0H21v8.2l-8.4-1.2v-7Z" />
    </F>
  );
}

export function AppleIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </S>
  );
}

export function TerminalIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </S>
  );
}

export function MonitorIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </S>
  );
}

export function GlobeIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </S>
  );
}

export function DownloadIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </S>
  );
}

export function BookIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </S>
  );
}

export function MenuIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </S>
  );
}

export function XIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </S>
  );
}

export function CopyIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </S>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M20 6 9 17l-5-5" />
    </S>
  );
}

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </S>
  );
}

export function ExternalIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </S>
  );
}

export function ShieldIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </S>
  );
}

export function GaugeIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </S>
  );
}

export function CpuIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </S>
  );
}

export function LayersIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </S>
  );
}

export function LinkIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </S>
  );
}

export function BoxIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </S>
  );
}

export function WrenchIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </S>
  );
}

export function SlidersIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <line x1="21" x2="14" y1="4" y2="4" />
      <line x1="10" x2="3" y1="4" y2="4" />
      <line x1="21" x2="12" y1="12" y2="12" />
      <line x1="8" x2="3" y1="12" y2="12" />
      <line x1="21" x2="16" y1="20" y2="20" />
      <line x1="12" x2="3" y1="20" y2="20" />
      <line x1="14" x2="14" y1="2" y2="6" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="16" x2="16" y1="18" y2="22" />
    </S>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </S>
  );
}

export function FileIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
    </S>
  );
}

export function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </S>
  );
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </S>
  );
}

export function RefreshIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </S>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <S className={className}>
      <path d="m6 9 6 6 6-6" />
    </S>
  );
}

