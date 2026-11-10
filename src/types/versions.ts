export interface Download {
  platform: string;
  architecture: string;
  filename: string;
  size: number;
  url: string;
  sha256: string;
}

export interface Release {
  version: string;
  releaseDate: string;
  stable: boolean;
  published: boolean;
  prerelease: boolean;
  changelog: string[];
  downloads: Download[];
}

export interface LanguageInfo {
  name: string;
  description: string;
  website: string;
}

export interface VersionsManifest {
  schemaVersion: number;
  language: LanguageInfo;
  latestVersion: string;
  releases: Release[];
}

export type VersionsStatus = "loading" | "success" | "empty" | "error";
