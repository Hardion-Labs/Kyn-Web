import { useMemo, useState } from "react";
import CodeBlock from "@/components/CodeBlock";
import DownloadButton from "@/components/downloads/DownloadButton";
import PlatformSelector, {
  getAvailableArchitectures,
  getAvailablePlatforms,
} from "@/components/downloads/PlatformSelector";
import VersionCard from "@/components/downloads/VersionCard";
import {
  AlertCircleIcon,
  AppleIcon,
  ArrowRightIcon,
  BoxIcon,
  CalendarIcon,
  CheckIcon,
  DownloadIcon,
  ExternalIcon,
  GithubIcon,
  GlobeIcon,
  KynLogo,
  RefreshIcon,
  ShieldIcon,
  TerminalIcon,
  WindowsIcon,
  WrenchIcon,
} from "@/components/Icons";
import SectionHeading from "@/components/SectionHeading";
import { useVersions } from "@/hooks/useVersions";
import { LATEST_RELEASE, RELEASES, REPO, VERSION, ZIP } from "@/lib/links";
import { type OSKey, PLATFORMS, detectArch, detectOS } from "@/lib/os";
import {
  findRecommendedDownload,
  formatBytes,
  formatExactBytes,
  formatPlatformName,
  formatReleaseDate,
  isPlaceholderSha256,
  normalizePlatformKey,
  resolveDriveLinks,
} from "@/services/versions.service";
import type { ComponentType } from "react";

const OS_ICONS: Record<OSKey, ComponentType<{ className?: string }>> = {
  windows: WindowsIcon,
  macos: AppleIcon,
  linux: TerminalIcon,
  android: GlobeIcon,
  ios: GlobeIcon,
  unknown: GlobeIcon,
};

const BUILD_SOURCE = `# 1. Clone the official language repository
git clone https://github.com/Hardion-Labs/Kyn.git
cd Kyn

# 2. Build the toolchain (Zig 0.17.0 + Clang)
zig build

# 3. Run the hello.kyn example
./zig-out/bin/kync run examples/hello.kyn`;

const REQUIREMENTS = [
  {
    icon: BoxIcon,
    name: "Zig 0.17.0",
    text: "The Kyn toolchain (kync + kyn-build) is written in Zig. Download it at ziglang.org/download.",
  },
  {
    icon: WrenchIcon,
    name: "Clang recente",
    text: "Used to assemble and link the emitted LLVM IR — it needs opaque pointer support.",
  },
  {
    icon: TerminalIcon,
    name: "ar + shell POSIX",
    text: "Available on the PATH for archiving and running the build scripts.",
  },
];

export default function Download() {
  const os = useMemo(detectOS, []);
  const arch = useMemo(detectArch, []);
  const OsIcon = OS_ICONS[os.key];

  const {
    status,
    releases,
    latestRelease,
    newestRelease,
    latestVersion,
    error,
    reload,
  } = useVersions();

  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedArchitecture, setSelectedArchitecture] = useState<string | null>(null);

  const recommendedDownload = useMemo(
    () => findRecommendedDownload(latestRelease, os.key, arch),
    [latestRelease, os.key, arch]
  );

  const recommendedDriveLinks = useMemo(
    () => (recommendedDownload ? resolveDriveLinks(recommendedDownload.url) : null),
    [recommendedDownload]
  );

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const activeRelease = useMemo(() => {
    if (releases.length === 0) return null;
    if (selectedVersion) {
      const found = releases.find((item) => item.version === selectedVersion);
      if (found) return found;
    }
    return latestRelease ?? releases[0];
  }, [releases, selectedVersion, latestRelease]);

  const availablePlatforms = useMemo(
    () => (activeRelease ? getAvailablePlatforms(activeRelease.downloads) : []),
    [activeRelease]
  );

  const activePlatform = useMemo(() => {
    if (availablePlatforms.length === 0) return "";
    if (selectedPlatform && availablePlatforms.includes(selectedPlatform)) {
      return selectedPlatform;
    }
    const detectedKey = normalizePlatformKey(os.key);
    if (detectedKey !== "unknown" && availablePlatforms.includes(detectedKey)) {
      return detectedKey;
    }
    return availablePlatforms[0];
  }, [availablePlatforms, selectedPlatform, os.key]);

  const availableArchitectures = useMemo(
    () =>
      activeRelease && activePlatform
        ? getAvailableArchitectures(activeRelease.downloads, activePlatform)
        : [],
    [activeRelease, activePlatform]
  );

  const activeArchitecture = useMemo(() => {
    if (availableArchitectures.length === 0) return "";
    if (selectedArchitecture && availableArchitectures.includes(selectedArchitecture)) {
      return selectedArchitecture;
    }
    if (arch && availableArchitectures.includes(arch)) {
      return arch;
    }
    return availableArchitectures[0];
  }, [availableArchitectures, selectedArchitecture, arch]);

  const matchingDownloads = useMemo(() => {
    if (!activeRelease || !activePlatform || !activeArchitecture) return [];
    return activeRelease.downloads.filter(
      (item) =>
        normalizePlatformKey(item.platform) === activePlatform &&
        item.architecture === activeArchitecture
    );
  }, [activeRelease, activePlatform, activeArchitecture]);

  const handleSelectVersion = (version: string) => {
    setSelectedVersion(version);
  };

  const handleSelectPlatform = (platform: string) => {
    setSelectedPlatform(platform);
    if (!activeRelease) return;
    const nextArchs = getAvailableArchitectures(activeRelease.downloads, platform);
    if (!nextArchs.includes(activeArchitecture)) {
      const preferred =
        arch && nextArchs.includes(arch) ? arch : (nextArchs[0] ?? null);
      setSelectedArchitecture(preferred);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
      <SectionHeading
        kicker="Download"
        title="Baixe e compile o toolchain Kyn"
        description="We automatically detect your operating system and show the downloads published per version, platform and architecture — plus the full guide to building from source."
      />

      {/* ===== OS detection ===== */}
      <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-amber-400">
              <OsIcon className="h-7 w-7" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Detected system
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-bold text-zinc-950">
                {os.name}
                {arch && (
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs font-medium text-zinc-600">
                    {arch}
                  </span>
                )}
              </p>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-zinc-600">{os.detail}</p>
              {os.recommended ? (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  <CheckIcon className="h-3.5 w-3.5" />
                  Platform officially validated in this release
                </span>
              ) : recommendedDownload ? (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  <CheckIcon className="h-3.5 w-3.5" />
                  Package available for {os.name} ({recommendedDownload.architecture})
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={REPO} target="_blank" rel="noreferrer" className="btn-secondary">
              <GithubIcon className="h-4 w-4" />
              Official repository
            </a>
            <a href={ZIP} target="_blank" rel="noreferrer" className="btn-secondary">
              ZIP archive
              <ExternalIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Highlight of the newest version found in the JSON */}
        {status === "loading" && (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-44 rounded bg-zinc-200" />
              <div className="h-5 w-72 rounded bg-zinc-200" />
            </div>
          </div>
        )}

        {status === "success" && latestRelease && (
          <div className="relative mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-white sm:p-6">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-56 rounded-full bg-amber-400/15 blur-2xl" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/30">
                    <KynLogo className="h-3 w-3" />
                    Latest version · {latestRelease.version}
                  </span>
                  {latestRelease.stable && !latestRelease.prerelease ? (
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                      Stable
                    </span>
                  ) : (
                    <span className="rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-xs font-semibold text-yellow-300 ring-1 ring-yellow-500/30">
                      Pre-release
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {formatReleaseDate(latestRelease.releaseDate)}
                  </span>
                  {newestRelease && newestRelease.version !== latestRelease.version && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVersion(newestRelease.version);
                        scrollToSection("official-downloads-heading");
                      }}
                      className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-zinc-300 transition hover:border-amber-400/50 hover:text-amber-300"
                    >
                      Newest preview: {newestRelease.version}
                    </button>
                  )}
                </div>

                {recommendedDownload && recommendedDriveLinks ? (
                  <>
                    <h2 className="mt-3 text-lg font-bold tracking-tight text-white sm:text-xl">
                      Recommended download for {formatPlatformName(recommendedDownload.platform)} (
                      {recommendedDownload.architecture})
                    </h2>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-zinc-300">
                      <span>{recommendedDownload.filename}</span>
                      <span aria-hidden="true" className="text-zinc-600">
                        ·
                      </span>
                      <span className="font-semibold text-amber-300">
                        {formatBytes(recommendedDownload.size)}
                      </span>
                      <span className="text-zinc-400">
                        ({formatExactBytes(recommendedDownload.size)})
                      </span>
                    </p>
                    <p className="mt-2 inline-flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
                      <ShieldIcon className="h-3.5 w-3.5 text-amber-400" />
                      <span>SHA-256:</span>
                      <code className="font-mono text-zinc-300">
                        {isPlaceholderSha256(recommendedDownload.sha256)
                          ? recommendedDownload.sha256
                          : `${recommendedDownload.sha256.slice(0, 16)}...`}
                      </code>
                      {(recommendedDriveLinks.isPlaceholder ||
                        isPlaceholderSha256(recommendedDownload.sha256)) && (
                        <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[11px] font-medium text-amber-300">
                          Waiting for the real Google Drive upload
                        </span>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="mt-3 text-lg font-bold tracking-tight text-white sm:text-xl">
                      Kyn {latestRelease.version} available in the catalog
                    </h2>
                    <p className="mt-1.5 text-sm text-zinc-300">
                      There is no prebuilt package specifically for{" "}
                      <strong className="text-white">{os.name}</strong> in this version.{" "}
                      {latestRelease.downloads.length > 0 && (
                        <>
                          Available platforms:{" "}
                          <span className="font-mono text-xs text-amber-300">
                            {latestRelease.downloads
                              .map(
                                (item) =>
                                  `${formatPlatformName(item.platform)} (${item.architecture})`
                              )
                              .join(" · ")}
                          </span>
                          .
                        </>
                      )}
                    </p>
                  </>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                {recommendedDownload && recommendedDriveLinks ? (
                  <>
                    <a
                      href={recommendedDriveLinks.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-amber !px-4 !py-2.5"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Download {latestRelease.version}
                    </a>
                    <a
                      href={recommendedDriveLinks.shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
                    >
                      Google Drive
                      <ExternalIcon className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => scrollToSection("official-downloads-heading")}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                    >
                      SHA-256 and other versions
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => scrollToSection("official-downloads-heading")}
                      className="btn-amber !px-4 !py-2.5"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      View available downloads
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("build-from-source")}
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
                    >
                      Build from source
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4 text-sm text-red-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
              <div>
                <p className="font-semibold">Could not detect the newest version in the JSON.</p>
                <p className="mt-0.5 text-xs text-red-800">{error}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void reload()}
                className="btn-secondary !border-red-300 !px-3 !py-1.5 !text-xs !text-red-900 hover:!bg-red-100"
              >
                <RefreshIcon className="h-3.5 w-3.5" />
                Try again
              </button>
              <a
                href={LATEST_RELEASE}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary !px-3 !py-1.5 !text-xs"
              >
                Release {VERSION}
                <ExternalIcon className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {status === "empty" && (
          <p className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            No binary version has been published in <code className="font-mono">versions.json</code> yet —
            use the build-from-source guide below.
          </p>
        )}

        {!os.recommended && !recommendedDownload && (
          <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
            In this release, the officially validated platform is <strong>Linux x86_64</strong>. On other
            systems, check the packages below or follow the build instructions for your platform.
          </p>
        )}
      </div>

      {/* ===== Versions and downloads from JSON ===== */}
      <section aria-labelledby="official-downloads-heading" className="mt-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="official-downloads-heading"
              className="text-xl font-bold tracking-tight text-zinc-950"
            >
              Downloads by version
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Static catalog of versions distributed via Google Drive with SHA-256 verification.
            </p>
          </div>
          {status === "success" && latestVersion && (
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700">
              <span>Current stable version:</span>
              <span className="font-mono font-semibold text-zinc-950">{latestVersion}</span>
            </div>
          )}
        </div>

        {/* State: Loading */}
        {status === "loading" && (
          <div
            role="status"
            aria-live="polite"
            className="mt-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="animate-pulse space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded bg-zinc-200" />
                  <div className="h-6 w-52 rounded bg-zinc-200" />
                </div>
                <div className="h-8 w-28 rounded-lg bg-zinc-100" />
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-28 rounded-xl bg-zinc-100" />
                <div className="h-10 w-28 rounded-xl bg-zinc-100" />
              </div>
              <div className="h-28 w-full rounded-xl bg-zinc-100" />
            </div>
            <p className="mt-4 text-xs text-zinc-500">Loading version catalog...</p>
          </div>
        )}

        {/* State: Error */}
        {status === "error" && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-200 bg-red-50/70 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                  <AlertCircleIcon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-red-950">
                    Could not load the available versions
                  </h3>
                  <p className="mt-1 text-sm text-red-800">
                    {error || "Failed to query the version manifest."}
                  </p>
                  <p className="mt-2 text-xs text-red-700">
                    You can still build Kyn from source or download directly from the{" "}
                    <a
                      href={RELEASES}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold underline underline-offset-2"
                    >
                      releases on GitHub
                    </a>
                    .
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void reload()}
                className="btn-secondary shrink-0 self-start !border-red-300 !text-red-900 hover:!bg-red-100"
              >
                <RefreshIcon className="h-4 w-4" />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* State: Empty */}
        {status === "empty" && (
          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 sm:p-8">
            <h3 className="text-base font-semibold text-zinc-950">
              No version published in the catalog
            </h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-600">
              There are no binary packages published in <code className="font-mono">versions.json</code> yet.
              See the instructions below to build from the official repository, or follow the
              releases on GitHub.
            </p>
          </div>
        )}

        {/* State: Success */}
        {status === "success" && activeRelease && (
          <div className="mt-5 space-y-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-2xl font-bold text-zinc-950">
                      {activeRelease.version}
                    </span>
                    {latestRelease?.version === activeRelease.version && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                        Current stable version
                      </span>
                    )}
                    {activeRelease.stable && !activeRelease.prerelease ? (
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
                    title={activeRelease.releaseDate}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Published on {formatReleaseDate(activeRelease.releaseDate)}
                  </p>
                </div>

                {releases.length > 1 && (
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="release-version-select"
                      className="text-xs font-semibold text-zinc-500"
                    >
                      Version:
                    </label>
                    <select
                      id="release-version-select"
                      value={activeRelease.version}
                      onChange={(e) => handleSelectVersion(e.target.value)}
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs font-semibold text-zinc-900 transition focus:border-zinc-950 focus:outline-none"
                    >
                      {releases.map((rel) => (
                        <option key={rel.version} value={rel.version}>
                          {rel.version}
                          {rel.version === latestVersion ? " (current)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-6">
                <PlatformSelector
                  downloads={activeRelease.downloads}
                  selectedPlatform={activePlatform}
                  selectedArchitecture={activeArchitecture}
                  detectedPlatform={os.key}
                  detectedArchitecture={arch}
                  onSelectPlatform={handleSelectPlatform}
                  onSelectArchitecture={setSelectedArchitecture}
                />

                {matchingDownloads.length > 0 ? (
                  <div className="space-y-3">
                    {matchingDownloads.map((download) => (
                      <DownloadButton
                        key={`${activeRelease.version}-${download.platform}-${download.architecture}-${download.filename}`}
                        download={download}
                      />
                    ))}
                  </div>
                ) : (
                  activeRelease.downloads.length > 0 && (
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                      No download found for{" "}
                      <strong>{formatPlatformName(activePlatform)}</strong> ({activeArchitecture}).
                    </div>
                  )
                )}

                {activeRelease.changelog.length > 0 && (
                  <div className="border-t border-zinc-100 pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                      What's new in {activeRelease.version}
                    </h3>
                    <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm text-zinc-600">
                      {activeRelease.changelog.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Full version history */}
            <div id="version-history" className="scroll-mt-24">
              <h3 className="text-lg font-bold tracking-tight text-zinc-950">
                Version history
              </h3>
              <p className="mt-1 text-sm text-zinc-600">
                All published versions with release dates, changelogs and files per platform.
              </p>
              <div className="mt-4 space-y-4">
                {releases.map((release) => (
                  <VersionCard
                    key={release.version}
                    release={release}
                    isLatest={
                      latestRelease ? release.version === latestRelease.version : false
                    }
                    isSelected={release.version === activeRelease.version}
                    onSelect={releases.length > 1 ? handleSelectVersion : undefined}
                    detectedPlatform={os.key}
                    detectedArchitecture={arch}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===== Requirements ===== */}
      <div className="mt-14">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">Requirements</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {REQUIREMENTS.map((r) => (
            <div key={r.name} className="rounded-xl border border-zinc-200 bg-white p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                <r.icon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-zinc-950">{r.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Build from source ===== */}
      <div id="build-from-source" className="mt-14 scroll-mt-24">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">Build from source</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          To try the latest features from the source code or build the toolchain locally, clone the
          official repository and build it with Zig:
        </p>
        <div className="mt-5">
          <CodeBlock code={BUILD_SOURCE} lang="sh" title="terminal" />
        </div>
      </div>

      {/* ===== Platforms ===== */}
      <div className="mt-14">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">Choose your platform</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Build-from-source instructions for Linux, Windows and macOS.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {PLATFORMS.map((p) => {
            const Icon = OS_ICONS[p.key];
            return (
              <div
                key={p.key}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-amber-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-zinc-950">{p.name}</h3>
                      <p className="font-mono text-xs text-zinc-500">{p.note}</p>
                    </div>
                  </div>
                  {os.key === p.key && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      Detected
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{p.blurb}</p>
                <div className="mt-4 flex-1">
                  <CodeBlock
                    code={p.commands}
                    lang="sh"
                    title={p.key}
                    className="shadow-none [&>pre]:text-xs"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={REPO} target="_blank" rel="noreferrer" className="btn-primary !px-3.5 !py-2 text-[13px]">
                    <GithubIcon className="h-3.5 w-3.5" />
                    Clone on GitHub
                  </a>
                  <a href={RELEASES} target="_blank" rel="noreferrer" className="btn-secondary !px-3.5 !py-2 text-[13px]">
                    Releases
                    <ExternalIcon className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Official links ===== */}
      <div className="mt-14 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">Official links</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { href: REPO, label: "github.com/Hardion-Labs/Kyn", desc: "Official repository of the Kyn language" },
            { href: LATEST_RELEASE, label: `Release ${VERSION}`, desc: "Latest published preview, with detailed notes" },
            { href: RELEASES, label: "Todas as releases", desc: "Full history of the project's previews" },
          ].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300"
              >
                <GithubIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition group-hover:text-zinc-950" />
                <span>
                  <span className="flex items-center gap-1.5 font-mono text-sm font-medium text-zinc-900">
                    {l.label}
                    <ExternalIcon className="h-3 w-3 text-zinc-400" />
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500">{l.desc}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
