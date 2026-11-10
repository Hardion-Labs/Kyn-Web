import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  fetchVersionsManifest,
  getCachedVersionsManifest,
  getLatestRelease,
  getPublishedReleases,
} from "@/services/versions.service";
import type { Release, VersionsManifest, VersionsStatus } from "@/types/versions";

interface VersionsSnapshot {
  status: VersionsStatus;
  manifest: VersionsManifest | null;
  error: string | null;
}

const initialCached = getCachedVersionsManifest();

let snapshot: VersionsSnapshot = initialCached
  ? {
      status: getPublishedReleases(initialCached).length > 0 ? "success" : "empty",
      manifest: initialCached,
      error: null,
    }
  : {
      status: "loading",
      manifest: null,
      error: null,
    };

let hasAttemptedInitialLoad = initialCached !== null;
const listeners = new Set<() => void>();

function emitSnapshot(next: VersionsSnapshot) {
  snapshot = next;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): VersionsSnapshot {
  return snapshot;
}

async function runLoad(force = false): Promise<void> {
  hasAttemptedInitialLoad = true;

  if (force || snapshot.status === "error") {
    emitSnapshot({
      status: "loading",
      manifest: force ? null : snapshot.manifest,
      error: null,
    });
  }

  try {
    const manifest = await fetchVersionsManifest({ force });
    const published = getPublishedReleases(manifest);
    emitSnapshot({
      status: published.length > 0 ? "success" : "empty",
      manifest,
      error: null,
    });
  } catch (err) {
    const message =
      err instanceof Error && err.message
        ? err.message
        : "Ocorreu um erro inesperado ao consultar as versões disponíveis.";

    emitSnapshot({
      status: "error",
      manifest: null,
      error: message,
    });
  }
}

export interface UseVersionsResult {
  status: VersionsStatus;
  manifest: VersionsManifest | null;
  releases: Release[];
  latestRelease: Release | null;
  latestVersion: string | null;
  error: string | null;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  reload: () => Promise<void>;
}

export function useVersions(): UseVersionsResult {
  const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (!hasAttemptedInitialLoad) {
      void runLoad(false);
    }
  }, []);

  const reload = useCallback(() => runLoad(true), []);

  const releases = useMemo(
    () => (current.manifest ? getPublishedReleases(current.manifest) : []),
    [current.manifest]
  );

  const latestRelease = useMemo(
    () => (current.manifest ? getLatestRelease(current.manifest) : null),
    [current.manifest]
  );

  const latestVersion = useMemo(() => {
    if (!current.manifest) return null;
    return current.manifest.latestVersion || latestRelease?.version || null;
  }, [current.manifest, latestRelease]);

  return {
    status: current.status,
    manifest: current.manifest,
    releases,
    latestRelease,
    latestVersion,
    error: current.error,
    isLoading: current.status === "loading",
    isError: current.status === "error",
    isEmpty: current.status === "empty",
    reload,
  };
}
