import { useState } from "react";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@/components/Icons";
import {
  formatPlatformName,
  formatReleaseDate,
  normalizePlatformKey,
} from "@/services/versions.service";
import type { Release } from "@/types/versions";
import { cn } from "@/utils/cn";
import DownloadButton from "./DownloadButton";
import PlatformSelector, {
  getAvailableArchitectures,
  getAvailablePlatforms,
} from "./PlatformSelector";

export interface VersionCardProps {
  release: Release;
  isLatest: boolean;
  isSelected?: boolean;
  onSelect?: (version: string) => void;
  detectedPlatform?: string;
  detectedArchitecture?: string | null;
}

function getDefaultSelection(
  release: Release,
  detectedPlatform?: string,
  detectedArchitecture?: string | null
) {
  const platforms = getAvailablePlatforms(release.downloads);
  const normalizedDetected = detectedPlatform ? normalizePlatformKey(detectedPlatform) : "";
  const platform =
    normalizedDetected && platforms.includes(normalizedDetected)
      ? normalizedDetected
      : (platforms[0] ?? "");
  const architectures = platform ? getAvailableArchitectures(release.downloads, platform) : [];
  const architecture =
    detectedArchitecture && architectures.includes(detectedArchitecture)
      ? detectedArchitecture
      : (architectures[0] ?? "");
  return { platform, architecture };
}

export default function VersionCard({
  release,
  isLatest,
  isSelected = false,
  onSelect,
  detectedPlatform,
  detectedArchitecture,
}: VersionCardProps) {
  const defaults = getDefaultSelection(release, detectedPlatform, detectedArchitecture);
  const [expanded, setExpanded] = useState(false);
  const [platform, setPlatform] = useState(defaults.platform);
  const [architecture, setArchitecture] = useState(defaults.architecture);

  const availablePlatforms = getAvailablePlatforms(release.downloads);
  const activePlatform = availablePlatforms.includes(platform)
    ? platform
    : (availablePlatforms[0] ?? "");
  const availableArchs = activePlatform
    ? getAvailableArchitectures(release.downloads, activePlatform)
    : [];
  const activeArch = availableArchs.includes(architecture)
    ? architecture
    : (availableArchs[0] ?? "");

  const matchingDownloads = release.downloads.filter(
    (item) =>
      normalizePlatformKey(item.platform) === activePlatform &&
      item.architecture === activeArch
  );

  const handlePlatformChange = (nextPlatform: string) => {
    setPlatform(nextPlatform);
    const nextArchs = getAvailableArchitectures(release.downloads, nextPlatform);
    if (!nextArchs.includes(activeArch)) {
      const preferred =
        detectedArchitecture && nextArchs.includes(detectedArchitecture)
          ? detectedArchitecture
          : (nextArchs[0] ?? "");
      setArchitecture(preferred);
    }
  };

  return (
    <article
      className={cn(
        "rounded-2xl border bg-white p-6 transition",
        isSelected
          ? "border-zinc-950 shadow-sm ring-1 ring-zinc-950/10"
          : "border-zinc-200 hover:border-zinc-300"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-mono text-xl font-bold text-zinc-950">{release.version}</h3>
            {isLatest && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                Current
              </span>
            )}
            {release.stable && !release.prerelease ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                Stable
              </span>
            ) : (
              <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                Pre-release
              </span>
            )}
          </div>
          <p
            className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-zinc-500"
            title={release.releaseDate}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            Published on {formatReleaseDate(release.releaseDate)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(release.version)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition",
                isSelected
                  ? "bg-zinc-950 text-white"
                  : "border border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50"
              )}
            >
              {isSelected && <CheckIcon className="h-3.5 w-3.5 text-amber-400" />}
              {isSelected ? "Selected" : "Select version"}
            </button>
          )}
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((prev) => !prev)}
            className="btn-secondary !px-3.5 !py-2 !text-xs"
          >
            {expanded ? "Hide files" : `View files (${release.downloads.length})`}
            <ChevronDownIcon
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                expanded && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {/* Summary of the platforms and architectures available in this version */}
      <div className="mt-4 flex flex-wrap gap-2">
        {release.downloads.length === 0 ? (
          <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500">
            No binary files attached
          </span>
        ) : (
          release.downloads.map((d) => (
            <span
              key={`${d.platform}-${d.architecture}-${d.filename}`}
              className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-xs text-zinc-700"
            >
              {formatPlatformName(d.platform)} · {d.architecture}
            </span>
          ))
        )}
      </div>

      {/* Changelog */}
      {release.changelog.length > 0 && (
        <div className="mt-4 border-t border-zinc-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Changelog
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
            {release.changelog.map((entry, idx) => (
              <li key={idx}>{entry}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Expanded area with the selector and the downloads for this version */}
      {expanded && (
        <div className="mt-5 space-y-4 border-t border-zinc-200 pt-5">
          <PlatformSelector
            downloads={release.downloads}
            selectedPlatform={activePlatform}
            selectedArchitecture={activeArch}
            detectedPlatform={detectedPlatform}
            detectedArchitecture={detectedArchitecture}
            onSelectPlatform={handlePlatformChange}
            onSelectArchitecture={setArchitecture}
          />
          {matchingDownloads.length > 0 ? (
            <div className="space-y-3">
              {matchingDownloads.map((item) => (
                <DownloadButton
                  key={`${item.platform}-${item.architecture}-${item.filename}`}
                  download={item}
                  compact
                />
              ))}
            </div>
          ) : (
            release.downloads.length > 0 && (
              <p className="text-sm text-zinc-500">
                No files found for the selected combination.
              </p>
            )
          )}
        </div>
      )}
    </article>
  );
}
