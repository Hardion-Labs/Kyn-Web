export type OSKey = "windows" | "macos" | "linux" | "reactos" | "android" | "ios" | "unknown";

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
    return { key: "unknown", name: "Desconhecido", detail: "", recommended: false };
  }
  const ua = navigator.userAgent || "";
  const plat = (navigator as Navigator & { platform?: string }).platform || "";
  const uaDataPlat =
    (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || "";

  // User agents do ReactOS historicamente contêm tokens "Windows NT" — testar primeiro.
  if (/reactos/i.test(ua) || /reactos/i.test(plat)) {
    return {
      key: "reactos",
      name: "ReactOS",
      detail: "sistema operacional open source compatível com Windows — veja github.com/reactos/reactos",
      recommended: false,
    };
  }
  if (/windows|win32|win64|windows nt/i.test(ua) || /^win/i.test(plat) || /windows/i.test(uaDataPlat)) {
    return {
      key: "windows",
      name: "Windows",
      detail: "recomendamos o WSL2: a toolchain nativa do Kyn (Zig + Clang + ar + shell POSIX) roda em ambiente Linux",
      recommended: false,
    };
  }
  if (/android/i.test(ua)) {
    return {
      key: "android",
      name: "Android",
      detail: "sem suporte oficial — use um ambiente desktop com Zig 0.17.0 + Clang e escolha a plataforma abaixo",
      recommended: false,
    };
  }
  if (/iphone|ipad|ipod/i.test(ua) || (plat === "MacIntel" && (navigator.maxTouchPoints || 0) > 1)) {
    return {
      key: "ios",
      name: "iOS / iPadOS",
      detail: "sem suporte oficial — use um ambiente desktop com Zig 0.17.0 + Clang e escolha a plataforma abaixo",
      recommended: false,
    };
  }
  if (/mac os x|macintosh/i.test(ua) || /^mac/i.test(plat) || /mac/i.test(uaDataPlat)) {
    return {
      key: "macos",
      name: "macOS",
      detail: "toolchain Zig + Clang disponível; nesta release a plataforma validada oficialmente é Linux x86_64",
      recommended: false,
    };
  }
  if (/linux|x11|freebsd|netbsd|openbsd|sunos/i.test(ua) || /linux/i.test(plat) || /linux/i.test(uaDataPlat)) {
    return {
      key: "linux",
      name: "Linux",
      detail: "plataforma oficialmente validada nesta release (x86_64, System V) — instalação direta",
      recommended: true,
    };
  }
  return {
    key: "unknown",
    name: "Sistema não identificado",
    detail: "escolha manualmente a sua plataforma nos cartões abaixo",
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
    blurb: "Plataforma oficialmente validada para o Kyn v0.1. Instale o Zig 0.17.0, o Clang e o ar, clone o repositório e compile.",
    commands: `# Zig 0.17.0 (https://ziglang.org/download/) + Clang + ar
sudo apt install clang   # ou o equivalente na sua distribuição

git clone https://github.com/Hardion-Labs/Kyn.git
cd Kyn
zig build
./zig-out/bin/kync run examples/hello.kyn`,
    validated: true,
  },
  {
    key: "windows",
    name: "Windows",
    note: "via WSL2 (recomendado)",
    blurb: "A toolchain nativa do Kyn depende de Zig, Clang, ar e um shell POSIX. No Windows, use o WSL2 e siga os mesmos passos do Linux.",
    commands: `# PowerShell — habilite o WSL2
wsl --install
wsl   # abra a distribuição Linux (ex.: Ubuntu)

# Dentro do WSL:
git clone https://github.com/Hardion-Labs/Kyn.git
cd Kyn
zig build
./zig-out/bin/kync run examples/hello.kyn`,
  },
  {
    key: "macos",
    name: "macOS",
    note: "Zig + Clang",
    blurb: "Instale as Command Line Tools (Clang) e o Zig 0.17.0. Nesta release, a plataforma validada oficialmente é Linux x86_64 — valide no seu ambiente.",
    commands: `# Command Line Tools (Clang) + Zig 0.17.0 (https://ziglang.org/download/)
xcode-select --install

git clone https://github.com/Hardion-Labs/Kyn.git
cd Kyn
zig build
./zig-out/bin/kync run examples/hello.kyn`,
  },
  {
    key: "reactos",
    name: "ReactOS",
    note: "github.com/reactos/reactos",
    blurb: "Kyn foi projetada para kernels e drivers — e o ReactOS é um sistema operacional open source compatível com Windows, um alvo natural para a linguagem.",
    commands: `# Repositório oficial do ReactOS:
https://github.com/reactos/reactos

# No ReactOS (via ROSBE / subsistema POSIX):
git clone https://github.com/Hardion-Labs/Kyn.git
cd Kyn
zig build
./zig-out/bin/kync run examples/hello.kyn`,
  },
];
