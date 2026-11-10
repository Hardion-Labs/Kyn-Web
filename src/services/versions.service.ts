import type { Download, LanguageInfo, Release, VersionsManifest } from "@/types/versions";

export const MANIFEST_URL = `${import.meta.env.BASE_URL}data/versions.json`;

const ALLOWED_DRIVE_HOSTS = new Set([
  "drive.google.com",
  "drive.usercontent.google.com",
]);

const DRIVE_FILE_ID_RE = /^[A-Za-z0-9_-]{2,200}$/;
const SHA256_HEX_RE = /^[a-fA-F0-9]{64}$/;

export type VersionsErrorCode =
  | "NETWORK_ERROR"
  | "HTTP_ERROR"
  | "INVALID_JSON"
  | "INVALID_SCHEMA";

export class VersionsServiceError extends Error {
  readonly code: VersionsErrorCode;

  constructor(code: VersionsErrorCode, message: string) {
    super(message);
    this.name = "VersionsServiceError";
    this.code = code;
  }
}

export interface ResolvedDriveLinks {
  downloadUrl: string;
  shareUrl: string;
  fileId: string;
  isPlaceholder: boolean;
}

function extractDriveFileId(parsed: URL): string | null {
  const host = parsed.hostname.toLowerCase();
  const path = parsed.pathname;

  if (host === "drive.google.com") {
    if (path === "/uc" || path === "/open") {
      const id = parsed.searchParams.get("id")?.trim() ?? "";
      return DRIVE_FILE_ID_RE.test(id) ? id : null;
    }

    const fileMatch = /^\/file\/d\/([A-Za-z0-9_-]{2,200})(?:\/(?:view|edit|preview)?)?$/.exec(path);
    if (fileMatch) {
      return fileMatch[1];
    }

    return null;
  }

  if (host === "drive.usercontent.google.com") {
    if (/^\/(?:u\/\d+\/)?download$/.test(path)) {
      const id = parsed.searchParams.get("id")?.trim() ?? "";
      return DRIVE_FILE_ID_RE.test(id) ? id : null;
    }
    return null;
  }

  return null;
}

export function isAllowedDownloadUrl(rawUrl: string): boolean {
  if (typeof rawUrl !== "string" || !rawUrl.trim()) return false;

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:") return false;
  if (parsed.username || parsed.password) return false;

  const host = parsed.hostname.toLowerCase();
  if (!ALLOWED_DRIVE_HOSTS.has(host)) return false;

  return extractDriveFileId(parsed) !== null;
}

export function isPlaceholderDriveId(fileId: string): boolean {
  const normalized = fileId.trim();
  return normalized === "FILE_ID" || /^REPLACE_WITH/i.test(normalized);
}

export function resolveDriveLinks(rawUrl: string): ResolvedDriveLinks | null {
  if (!isAllowedDownloadUrl(rawUrl)) return null;

  const parsed = new URL(rawUrl.trim());
  const fileId = extractDriveFileId(parsed);
  if (!fileId) return null;

  const host = parsed.hostname.toLowerCase();
  const isDirectEndpoint =
    (host === "drive.google.com" && parsed.pathname === "/uc") ||
    host === "drive.usercontent.google.com";

  const encodedId = encodeURIComponent(fileId);
  const downloadUrl = isDirectEndpoint
    ? parsed.toString()
    : `https://drive.google.com/uc?id=${encodedId}&export=download`;

  const isFilePage = host === "drive.google.com" && parsed.pathname.startsWith("/file/d/");
  const shareUrl = isFilePage
    ? parsed.toString()
    : `https://drive.google.com/file/d/${encodedId}/view`;

  if (!isAllowedDownloadUrl(downloadUrl) || !isAllowedDownloadUrl(shareUrl)) {
    return null;
  }

  return {
    downloadUrl,
    shareUrl,
    fileId,
    isPlaceholder: isPlaceholderDriveId(fileId),
  };
}

export function isValidSha256(hash: string): boolean {
  return typeof hash === "string" && SHA256_HEX_RE.test(hash.trim());
}

export function isPlaceholderSha256(hash: string): boolean {
  if (typeof hash !== "string") return true;
  const trimmed = hash.trim();
  return !trimmed || /^REPLACE_WITH/i.test(trimmed) || !isValidSha256(trimmed);
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIdx = 0;

  while (value >= 1024 && unitIdx < units.length - 1) {
    value /= 1024;
    unitIdx += 1;
  }

  const formatted = Number.isInteger(value)
    ? value.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : value.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return `${formatted} ${units[unitIdx]}`;
}

export function formatExactBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 bytes";
  return `${Math.round(bytes).toLocaleString("en-US")} bytes`;
}

export function formatReleaseDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return isoDate;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month, day));

  if (Number.isNaN(utcDate.getTime())) return isoDate;

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcDate);
}

export function normalizePlatformKey(platform: string): string {
  const key = platform.trim().toLowerCase();
  if (key === "darwin" || key === "osx") return "macos";
  return key;
}

export function formatPlatformName(platform: string): string {
  switch (normalizePlatformKey(platform)) {
    case "linux":
      return "Linux";
    case "windows":
      return "Windows";
    case "macos":
      return "macOS";
    default: {
      const trimmed = platform.trim();
      return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : "Unknown";
    }
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new VersionsServiceError("INVALID_SCHEMA", `Field "${field}" is invalid or missing.`);
  }
  return value.trim();
}

function validateLanguage(raw: unknown): LanguageInfo {
  if (!isPlainObject(raw)) {
    throw new VersionsServiceError("INVALID_SCHEMA", 'Invalid "language" block in the manifest.');
  }

  const name = assertNonEmptyString(raw.name, "language.name");
  const description = assertNonEmptyString(raw.description, "language.description");
  const website = assertNonEmptyString(raw.website, "language.website");

  let parsedWebsite: URL;
  try {
    parsedWebsite = new URL(website);
  } catch {
    throw new VersionsServiceError("INVALID_SCHEMA", 'Field "language.website" is not a valid URL.');
  }
  if (parsedWebsite.protocol !== "https:") {
    throw new VersionsServiceError("INVALID_SCHEMA", 'Field "language.website" must use HTTPS.');
  }

  return { name, description, website: parsedWebsite.toString() };
}

function validateDownload(raw: unknown, releaseIndex: number, downloadIndex: number): Download | null {
  const prefix = `releases[${releaseIndex}].downloads[${downloadIndex}]`;
  if (!isPlainObject(raw)) {
    throw new VersionsServiceError("INVALID_SCHEMA", `Invalid item "${prefix}".`);
  }

  const platform = assertNonEmptyString(raw.platform, `${prefix}.platform`);
  const architecture = assertNonEmptyString(raw.architecture, `${prefix}.architecture`);
  const filename = assertNonEmptyString(raw.filename, `${prefix}.filename`);

  if (typeof raw.size !== "number" || !Number.isFinite(raw.size) || raw.size < 0) {
    throw new VersionsServiceError("INVALID_SCHEMA", `Invalid size in "${prefix}.size".`);
  }

  const url = assertNonEmptyString(raw.url, `${prefix}.url`);
  if (typeof raw.sha256 !== "string") {
    throw new VersionsServiceError("INVALID_SCHEMA", `Field "${prefix}.sha256" must be a string.`);
  }

  if (!isAllowedDownloadUrl(url)) {
    console.warn(`Download skipped because its URL is not allowed in ${prefix}: ${url}`);
    return null;
  }

  return {
    platform: normalizePlatformKey(platform),
    architecture,
    filename,
    size: raw.size,
    url,
    sha256: raw.sha256.trim(),
  };
}

function validateRelease(raw: unknown, index: number): Release {
  const prefix = `releases[${index}]`;
  if (!isPlainObject(raw)) {
    throw new VersionsServiceError("INVALID_SCHEMA", `Invalid item "${prefix}".`);
  }

  const version = assertNonEmptyString(raw.version, `${prefix}.version`);
  const releaseDate = assertNonEmptyString(raw.releaseDate, `${prefix}.releaseDate`);

  if (typeof raw.stable !== "boolean") {
    throw new VersionsServiceError("INVALID_SCHEMA", `Field "${prefix}.stable" must be a boolean.`);
  }
  if (typeof raw.published !== "boolean") {
    throw new VersionsServiceError("INVALID_SCHEMA", `Field "${prefix}.published" must be a boolean.`);
  }
  if (typeof raw.prerelease !== "boolean") {
    throw new VersionsServiceError("INVALID_SCHEMA", `Field "${prefix}.prerelease" must be a boolean.`);
  }

  if (!Array.isArray(raw.changelog) || raw.changelog.some((item) => typeof item !== "string")) {
    throw new VersionsServiceError("INVALID_SCHEMA", `Field "${prefix}.changelog" must be a list of strings.`);
  }

  if (!Array.isArray(raw.downloads)) {
    throw new VersionsServiceError("INVALID_SCHEMA", `Field "${prefix}.downloads" must be a list.`);
  }

  const downloads = raw.downloads
    .map((item, downloadIdx) => validateDownload(item, index, downloadIdx))
    .filter((item): item is Download => item !== null);

  return {
    version,
    releaseDate,
    stable: raw.stable,
    published: raw.published,
    prerelease: raw.prerelease,
    changelog: raw.changelog.map((entry) => entry.trim()).filter(Boolean),
    downloads,
  };
}

export function validateManifest(raw: unknown): VersionsManifest {
  if (!isPlainObject(raw)) {
    throw new VersionsServiceError("INVALID_SCHEMA", "The versions manifest must be a JSON object.");
  }

  if (typeof raw.schemaVersion !== "number" || !Number.isInteger(raw.schemaVersion)) {
    throw new VersionsServiceError("INVALID_SCHEMA", 'Field "schemaVersion" is missing or invalid.');
  }
  if (raw.schemaVersion !== 1) {
    throw new VersionsServiceError(
      "INVALID_SCHEMA",
      `Unsupported schema version: ${raw.schemaVersion}.`
    );
  }

  const language = validateLanguage(raw.language);

  if (typeof raw.latestVersion !== "string") {
    throw new VersionsServiceError("INVALID_SCHEMA", 'Field "latestVersion" must be a string.');
  }

  if (!Array.isArray(raw.releases)) {
    throw new VersionsServiceError("INVALID_SCHEMA", 'Field "releases" must be a list.');
  }

  const releases = raw.releases.map((rel, idx) => validateRelease(rel, idx));

  return {
    schemaVersion: raw.schemaVersion,
    language,
    latestVersion: raw.latestVersion.trim(),
    releases,
  };
}

interface ParsedSemver {
  core: number[];
  prerelease: string[];
}

function parseSemver(raw: string): ParsedSemver | null {
  const cleaned = raw.trim().replace(/^v/i, "").split("+")[0];
  if (!cleaned) return null;

  const dashIdx = cleaned.indexOf("-");
  const corePart = dashIdx === -1 ? cleaned : cleaned.slice(0, dashIdx);
  const prePart = dashIdx === -1 ? "" : cleaned.slice(dashIdx + 1);

  const coreSegments = corePart.split(".");
  if (coreSegments.length === 0 || coreSegments.some((seg) => !/^\d+$/.test(seg))) {
    return null;
  }

  const core = coreSegments.map((seg) => Number(seg));
  while (core.length < 3) core.push(0);

  const prerelease = prePart ? prePart.split(".").filter(Boolean) : [];
  return { core, prerelease };
}

function comparePrereleaseIdentifiers(a: string, b: string): number {
  const aNum = /^\d+$/.test(a);
  const bNum = /^\d+$/.test(b);

  if (aNum && bNum) return Number(a) - Number(b);
  if (aNum) return -1;
  if (bNum) return 1;
  return a.localeCompare(b);
}

export function compareVersions(a: string, b: string): number {
  const pa = parseSemver(a);
  const pb = parseSemver(b);

  if (!pa || !pb) {
    return a.trim().localeCompare(b.trim(), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  const maxCore = Math.max(pa.core.length, pb.core.length);
  for (let i = 0; i < maxCore; i += 1) {
    const diff = (pa.core[i] ?? 0) - (pb.core[i] ?? 0);
    if (diff !== 0) return diff;
  }

  if (pa.prerelease.length === 0 && pb.prerelease.length === 0) return 0;
  if (pa.prerelease.length === 0) return 1;
  if (pb.prerelease.length === 0) return -1;

  const maxPre = Math.max(pa.prerelease.length, pb.prerelease.length);
  for (let i = 0; i < maxPre; i += 1) {
    const ai = pa.prerelease[i];
    const bi = pb.prerelease[i];
    if (ai === undefined) return -1;
    if (bi === undefined) return 1;
    const diff = comparePrereleaseIdentifiers(ai, bi);
    if (diff !== 0) return diff;
  }

  return 0;
}

function compareReleasesNewestFirst(a: Release, b: Release): number {
  const versionDiff = compareVersions(b.version, a.version);
  if (versionDiff !== 0) return versionDiff;
  return b.releaseDate.localeCompare(a.releaseDate);
}

export function getPublishedReleases(manifest: VersionsManifest): Release[] {
  const published = manifest.releases.filter((release) => release.published);
  return [...published].sort(compareReleasesNewestFirst);
}

export function getNewestRelease(manifest: VersionsManifest): Release | null {
  const published = getPublishedReleases(manifest);
  return published[0] ?? null;
}

export function getLatestRelease(manifest: VersionsManifest): Release | null {
  const published = getPublishedReleases(manifest);
  if (published.length === 0) return null;

  const stablePublished = published.filter((release) => release.stable && !release.prerelease);
  if (stablePublished.length > 0) {
    const newestStable = stablePublished[0];
    const declaredLatest = manifest.latestVersion
      ? stablePublished.find((release) => release.version === manifest.latestVersion)
      : undefined;

    if (declaredLatest && compareVersions(declaredLatest.version, newestStable.version) >= 0) {
      return declaredLatest;
    }

    return newestStable;
  }

  return (
    (manifest.latestVersion
      ? published.find((release) => release.version === manifest.latestVersion)
      : undefined) ?? published[0]
  );
}

export function findRecommendedDownload(
  release: Release | null,
  osKey: string,
  arch: string | null
): Download | null {
  if (!release || release.downloads.length === 0) return null;

  const targetPlatform = normalizePlatformKey(osKey);
  if (!targetPlatform || targetPlatform === "unknown") return null;

  const platformMatches = release.downloads.filter(
    (item) => normalizePlatformKey(item.platform) === targetPlatform
  );
  if (platformMatches.length === 0) return null;

  if (arch) {
    const exactArch = platformMatches.find(
      (item) => item.architecture.toLowerCase() === arch.toLowerCase()
    );
    if (exactArch) return exactArch;
  }

  return (
    platformMatches.find((item) => item.architecture.toLowerCase() === "x86_64") ??
    platformMatches[0]
  );
}

let cachedManifest: VersionsManifest | null = null;
let inFlightPromise: Promise<VersionsManifest> | null = null;

export function getCachedVersionsManifest(): VersionsManifest | null {
  return cachedManifest;
}

export function resetVersionsCache(): void {
  cachedManifest = null;
  inFlightPromise = null;
}

export async function fetchVersionsManifest(options?: {
  force?: boolean;
}): Promise<VersionsManifest> {
  const force = options?.force ?? false;

  if (!force && cachedManifest) {
    return cachedManifest;
  }

  if (!force && inFlightPromise) {
    return inFlightPromise;
  }

  const request = (async () => {
    let response: Response;
    try {
      response = await fetch(MANIFEST_URL, {
        cache: "no-cache",
        headers: {
          Accept: "application/json",
        },
      });
    } catch {
      throw new VersionsServiceError(
        "NETWORK_ERROR",
        "Could not connect to the server to load the version catalog."
      );
    }

    if (!response.ok) {
      throw new VersionsServiceError(
        "HTTP_ERROR",
        `Could not load the version catalog (HTTP ${response.status}).`
      );
    }

    let rawData: unknown;
    try {
      rawData = await response.json();
    } catch {
      throw new VersionsServiceError(
        "INVALID_JSON",
        "The received version catalog is not valid JSON."
      );
    }

    const validated = validateManifest(rawData);
    cachedManifest = validated;
    return validated;
  })();

  inFlightPromise = request;

  try {
    return await request;
  } finally {
    if (inFlightPromise === request) {
      inFlightPromise = null;
    }
  }
}
