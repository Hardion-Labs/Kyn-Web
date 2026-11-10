export type OSKey = "windows" | "macos" | "linux" | "android" | "ios" | "unknown";

export interface OSInfo {
  key: OSKey;
  name: string;
  detail: string;
  recommended: boolean;
}

export function detectArch(): string | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  const uaData = (navigator as unknown as { userAgentData?: { architecture?: string } }).userAgentData;
  const arch = uaData?.architecture || "";
  if (/x86_64|amd64|win64/i.test(arch) || /x86_64|amd64|win64/i.test(ua)) return "x86_64";
  if (/arm64|aarch64/i.test(arch) || /arm64|aarch64/i.test(ua)) return "arm64";
  return null;
}

export function detectOS(): OSInfo {
  if (typeof navigator === "undefined") {
    return { key: "unknown", name: "Unknown", detail: "", recommended: false };
  }
  const ua = navigator.userAgent || "";
  const plat = (navigator as Navigator & { platform?: string }).platform || "";
  const uaDataPlat =
    (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || "";

  if (/windows|win32|win64|windows nt/i.test(ua) || /^win/i.test(plat) || /windows/i.test(uaDataPlat)) {
    return {
      key: "windows",
      name: "Windows",
      detail: "we recommend WSL2: the native Kyn toolchain (Zig + Clang + ar + POSIX shell) runs in a Linux environment",
      recommended: false,
    };
  }
  if (/android/i.test(ua)) {
    return {
      key: "android",
      name: "Android",
      detail: "no official support — use a desktop environment with Zig 0.17.0 + Clang and choose your platform below",
      recommended: false,
    };
  }
  if (/iphone|ipad|ipod/i.test(ua) || (plat === "MacIntel" && (navigator.maxTouchPoints || 0) > 1)) {
    return {
      key: "ios",
      name: "iOS / iPadOS",
      detail: "no official support — use a desktop environment with Zig 0.17.0 + Clang and choose your platform below",
      recommended: false,
    };
  }
  if (/mac os x|macintosh/i.test(ua) || /^mac/i.test(plat) || /mac/i.test(uaDataPlat)) {
    return {
      key: "macos",
      name: "macOS",
      detail: "Zig + Clang toolchain available; in this release, the officially validated platform is Linux x86_64",
      recommended: false,
    };
  }
  if (/linux|x11|freebsd|netbsd|openbsd|sunos/i.test(ua) || /linux/i.test(plat) || /linux/i.test(uaDataPlat)) {
    return {
      key: "linux",
      name: "Linux",
      detail: "officially validated platform in this release (x86_64, System V) — direct installation",
      recommended: true,
    };
  }
  return {
    key: "unknown",
    name: "Unidentified system",
    detail: "choose your platform manually from the cards below",
    recommended: false,
  };
}

export interface Platform {
  key: OSKey;
  name: string;
  note: string;
  blurb: string;
  commands: string;
  validated?: boolean;
}

export const PLATFORMS: Platform[] = [
  {
    key: "linux",
    name: "Linux",
    note: "x86_64 · System V",
    blurb: "Officially validated platform for Kyn v0.1. Install Zig 0.17.0, Clang and ar, clone the repository, and build it.",
    commands: `# Zig 0.17.0 (https://ziglang.org/download/) + Clang + ar
sudo apt install clang   # or the equivalent for your distribution

git clone https://github.com/Hardion-Labs/Kyn.git
cd Kyn
zig build
./zig-out/bin/kync run examples/hello.kyn`,
    validated: true,
  },
  {
    key: "windows",
    name: "Windows",
    note: "via WSL2 (recommended)",
    blurb: "The native Kyn toolchain depends on Zig, Clang, ar and a POSIX shell. On Windows, use WSL2 and follow the same steps as Linux.",
    commands: `# PowerShell — enable WSL2
wsl --install
wsl   # open your Linux distribution (e.g., Ubuntu)

# Inside WSL:
git clone https://github.com/Hardion-Labs/Kyn.git
cd Kyn
zig build
./zig-out/bin/kync run examples/hello.kyn`,
  },
  {
    key: "macos",
    name: "macOS",
    note: "Zig + Clang",
    blurb: "Install the Command Line Tools (Clang) and Zig 0.17.0. In this release, the officially validated platform is Linux x86_64 — verify it in your environment.",
    commands: `# Command Line Tools (Clang) + Zig 0.17.0 (https://ziglang.org/download/)
xcode-select --install

git clone https://github.com/Hardion-Labs/Kyn.git
cd Kyn
zig build
./zig-out/bin/kync run examples/hello.kyn`,
  },
];
