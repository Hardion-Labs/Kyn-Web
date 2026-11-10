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
  BoxIcon,
  CalendarIcon,
  CheckIcon,
  DownloadIcon,
  ExternalIcon,
  GithubIcon,
  GlobeIcon,
  MonitorIcon,
  RefreshIcon,
  TerminalIcon,
  WindowsIcon,
  WrenchIcon,
} from "@/components/Icons";
import SectionHeading from "@/components/SectionHeading";
import { useVersions } from "@/hooks/useVersions";
import { LATEST_RELEASE, REACTOS, RELEASES, REPO, VERSION, ZIP } from "@/lib/links";
import { type OSKey, PLATFORMS, detectArch, detectOS } from "@/lib/os";
import {
  formatPlatformName,
  formatReleaseDate,
  normalizePlatformKey,
} from "@/services/versions.service";
import type { ComponentType } from "react";

const OS_ICONS: Record<OSKey, ComponentType<{ className?: string }>> = {
  windows: WindowsIcon,
  macos: AppleIcon,
  linux: TerminalIcon,
  reactos: MonitorIcon,
  android: GlobeIcon,
  ios: GlobeIcon,
  unknown: GlobeIcon,
};

const BUILD_SOURCE = `# 1. Clone o repositório oficial da linguagem
git clone https://github.com/Hardion-Labs/Kyn.git
cd Kyn

# 2. Compile o toolchain (Zig 0.17.0 + Clang)
zig build

# 3. Rode o exemplo hello.kyn
./zig-out/bin/kync run examples/hello.kyn`;

const REQUIREMENTS = [
  {
    icon: BoxIcon,
    name: "Zig 0.17.0",
    text: "O toolchain do Kyn (kync + kyn-build) é escrito em Zig. Baixe em ziglang.org/download.",
  },
  {
    icon: WrenchIcon,
    name: "Clang recente",
    text: "Usado para montar e linkar o LLVM IR emitido — precisa de suporte a opaque pointers.",
  },
  {
    icon: TerminalIcon,
    name: "ar + shell POSIX",
    text: "Disponíveis na PATH para arquivamento e execução dos scripts de build.",
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
    latestVersion,
    error,
    reload,
  } = useVersions();

  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedArchitecture, setSelectedArchitecture] = useState<string | null>(null);

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
        description="Analisamos o seu sistema operacional automaticamente e exibimos os downloads publicados por versão, plataforma e arquitetura — além do guia completo para compilar a partir do código-fonte."
      />

      {/* ===== Detecção de SO ===== */}
      <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-amber-400">
              <OsIcon className="h-7 w-7" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Sistema detectado
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
              {os.recommended && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  <CheckIcon className="h-3.5 w-3.5" />
                  Plataforma validada oficialmente nesta release
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={REPO} target="_blank" rel="noreferrer" className="btn-primary">
              <GithubIcon className="h-4 w-4" />
              Repositório oficial
            </a>
            <a href={LATEST_RELEASE} target="_blank" rel="noreferrer" className="btn-secondary">
              <DownloadIcon className="h-4 w-4" />
              Release {VERSION}
            </a>
            <a href={ZIP} target="_blank" rel="noreferrer" className="btn-secondary">
              Baixar ZIP
              <ExternalIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        {!os.recommended && (
          <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
            Nesta release, a plataforma validada oficialmente é <strong>Linux x86_64</strong>. Nos demais
            sistemas, consulte os pacotes abaixo ou siga as instruções de compilação para sua plataforma.
          </p>
        )}
      </div>

      {/* ===== Versões e downloads via JSON ===== */}
      <section aria-labelledby="downloads-oficiais-heading" className="mt-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="downloads-oficiais-heading"
              className="text-xl font-bold tracking-tight text-zinc-950"
            >
              Downloads por versão
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Catálogo estático de versões distribuídas via Google Drive com verificação SHA-256.
            </p>
          </div>
          {status === "success" && latestVersion && (
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700">
              <span>Versão estável atual:</span>
              <span className="font-mono font-semibold text-zinc-950">{latestVersion}</span>
            </div>
          )}
        </div>

        {/* Estado: Loading */}
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
            <p className="mt-4 text-xs text-zinc-500">Carregando catálogo de versões...</p>
          </div>
        )}

        {/* Estado: Error */}
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
                    Não foi possível carregar as versões disponíveis
                  </h3>
                  <p className="mt-1 text-sm text-red-800">
                    {error || "Falha ao consultar o manifesto de versões."}
                  </p>
                  <p className="mt-2 text-xs text-red-700">
                    Você ainda pode compilar o Kyn a partir do código-fonte ou baixar diretamente pelas{" "}
                    <a
                      href={RELEASES}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold underline underline-offset-2"
                    >
                      releases no GitHub
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
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Estado: Empty */}
        {status === "empty" && (
          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 sm:p-8">
            <h3 className="text-base font-semibold text-zinc-950">
              Nenhuma versão publicada no catálogo
            </h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Ainda não há pacotes binários publicados em <code className="font-mono">versions.json</code>.
              Consulte as instruções abaixo para compilar a partir do repositório oficial ou acompanhe as
              releases no GitHub.
            </p>
          </div>
        )}

        {/* Estado: Success */}
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
                        Versão estável atual
                      </span>
                    )}
                    {activeRelease.stable && !activeRelease.prerelease ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                        Estável
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                        Pré-lançamento
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-zinc-500"
                    title={activeRelease.releaseDate}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Publicado em {formatReleaseDate(activeRelease.releaseDate)}
                  </p>
                </div>

                {releases.length > 1 && (
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="release-version-select"
                      className="text-xs font-semibold text-zinc-500"
                    >
                      Versão:
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
                          {rel.version === latestVersion ? " (atual)" : ""}
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
                      Nenhum download encontrado para{" "}
                      <strong>{formatPlatformName(activePlatform)}</strong> ({activeArchitecture}).
                    </div>
                  )
                )}

                {activeRelease.changelog.length > 0 && (
                  <div className="border-t border-zinc-100 pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                      Novidades da versão {activeRelease.version}
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

            {/* Histórico completo de versões */}
            <div id="historico-versoes" className="scroll-mt-24">
              <h3 className="text-lg font-bold tracking-tight text-zinc-950">
                Histórico de versões
              </h3>
              <p className="mt-1 text-sm text-zinc-600">
                Todas as versões publicadas com datas de lançamento, changelogs e arquivos por plataforma.
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

      {/* ===== Requisitos ===== */}
      <div className="mt-14">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">Requisitos</h2>
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

      {/* ===== Compilar da fonte ===== */}
      <div className="mt-14">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">Compilar a partir da fonte</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Para testar os recursos mais recentes do código-fonte ou gerar o toolchain localmente, clone o
          repositório oficial e compile com o Zig:
        </p>
        <div className="mt-5">
          <CodeBlock code={BUILD_SOURCE} lang="sh" title="terminal" />
        </div>
      </div>

      {/* ===== Plataformas ===== */}
      <div className="mt-14">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">Escolha a sua plataforma</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Instruções de compilação da fonte para Linux, Windows, macOS e ReactOS.
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
                      Detectado
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{p.blurb}</p>
                <div className="mt-4 flex-1">
                  <CodeBlock
                    code={p.commands}
                    lang="sh"
                    title={p.key === "reactos" ? "reactos" : p.key}
                    className="shadow-none [&>pre]:text-xs"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={REPO} target="_blank" rel="noreferrer" className="btn-primary !px-3.5 !py-2 text-[13px]">
                    <GithubIcon className="h-3.5 w-3.5" />
                    Clonar no GitHub
                  </a>
                  <a href={RELEASES} target="_blank" rel="noreferrer" className="btn-secondary !px-3.5 !py-2 text-[13px]">
                    Releases
                    <ExternalIcon className="h-3 w-3" />
                  </a>
                  {p.key === "reactos" && (
                    <a href={REACTOS} target="_blank" rel="noreferrer" className="btn-secondary !px-3.5 !py-2 text-[13px]">
                      reactos/reactos
                      <ExternalIcon className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Links oficiais ===== */}
      <div className="mt-14 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">Links oficiais</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { href: REPO, label: "github.com/Hardion-Labs/Kyn", desc: "Repositório oficial da linguagem Kyn" },
            { href: LATEST_RELEASE, label: `Release ${VERSION}`, desc: "Última preview publicada, com notas detalhadas" },
            { href: RELEASES, label: "Todas as releases", desc: "Histórico completo de previews do projeto" },
            { href: REACTOS, label: "github.com/reactos/reactos", desc: "Repositório oficial do ReactOS — SO open source compatível com Windows" },
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
