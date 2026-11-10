import type { ComponentType } from "react";
import {
  AppleIcon,
  GlobeIcon,
  MonitorIcon,
  TerminalIcon,
  WindowsIcon,
} from "@/components/Icons";
import {
  formatPlatformName,
  normalizePlatformKey,
} from "@/services/versions.service";
import type { Download } from "@/types/versions";
import { cn } from "@/utils/cn";

const PLATFORM_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  linux: TerminalIcon,
  windows: WindowsIcon,
  macos: AppleIcon,
  reactos: MonitorIcon,
};

export interface PlatformSelectorProps {
  downloads: Download[];
  selectedPlatform: string;
  selectedArchitecture: string;
  detectedPlatform?: string;
  detectedArchitecture?: string | null;
  onSelectPlatform: (platform: string) => void;
  onSelectArchitecture: (architecture: string) => void;
}

export function getAvailablePlatforms(downloads: Download[]): string[] {
  const seen = new Set<string>();
  const platforms: string[] = [];

  for (const item of downloads) {
    const key = normalizePlatformKey(item.platform);
    if (!seen.has(key)) {
      seen.add(key);
      platforms.push(key);
    }
  }

  return platforms;
}

export function getAvailableArchitectures(downloads: Download[], platform: string): string[] {
  const target = normalizePlatformKey(platform);
  const seen = new Set<string>();
  const architectures: string[] = [];

  for (const item of downloads) {
    if (normalizePlatformKey(item.platform) !== target) continue;
    if (!seen.has(item.architecture)) {
      seen.add(item.architecture);
      architectures.push(item.architecture);
    }
  }

  return architectures;
}

export default function PlatformSelector({
  downloads,
  selectedPlatform,
  selectedArchitecture,
  detectedPlatform,
  detectedArchitecture,
  onSelectPlatform,
  onSelectArchitecture,
}: PlatformSelectorProps) {
  const platforms = getAvailablePlatforms(downloads);
  const activePlatform = platforms.includes(selectedPlatform)
    ? selectedPlatform
    : (platforms[0] ?? "");
  const architectures = activePlatform
    ? getAvailableArchitectures(downloads, activePlatform)
    : [];
  const activeArchitecture = architectures.includes(selectedArchitecture)
    ? selectedArchitecture
    : (architectures[0] ?? "");

  if (platforms.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-4 text-sm text-zinc-500">
        No distributable files are available for this version.
      </div>
    );
  }

  const normalizedDetectedPlatform = detectedPlatform
    ? normalizePlatformKey(detectedPlatform)
    : null;
  const detectedAvailable =
    normalizedDetectedPlatform !== null &&
    normalizedDetectedPlatform !== "unknown" &&
    platforms.includes(normalizedDetectedPlatform);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Operating system
          </span>
          {normalizedDetectedPlatform &&
            normalizedDetectedPlatform !== "unknown" &&
            !detectedAvailable && (
              <span className="text-xs text-zinc-500">
                No package for {formatPlatformName(normalizedDetectedPlatform)} in this version
              </span>
            )}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {platforms.map((platform) => {
            const Icon = PLATFORM_ICONS[platform] ?? GlobeIcon;
            const isSelected = platform === activePlatform;
            const isDetected = normalizedDetectedPlatform === platform;

            return (
              <button
                key={platform}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectPlatform(platform)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition",
                  isSelected
                    ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isSelected ? "text-amber-400" : "text-zinc-500"
                  )}
                />
                <span>{formatPlatformName(platform)}</span>
                {isDetected && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium",
                      isSelected
                        ? "bg-amber-400/20 text-amber-300"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    Detected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {architectures.length > 0 && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Architecture
          </span>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {architectures.map((arch) => {
              const isSelected = arch === activeArchitecture;
              const isDetected = Boolean(detectedArchitecture && detectedArchitecture === arch);

              return (
                <button
                  key={arch}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectArchitecture(arch)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition",
                    isSelected
                      ? "border-amber-400 bg-amber-50 text-zinc-950 ring-1 ring-amber-400/40"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                  )}
                >
                  <span>{arch}</span>
                  {isDetected && (
                    <span className="rounded bg-amber-200/70 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-amber-900">
                      your CPU
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
