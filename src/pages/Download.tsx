import { useMemo } from "react";
import CodeBlock from "@/components/CodeBlock";
import SectionHeading from "@/components/SectionHeading";
import {
  AppleIcon,
  BoxIcon,
  CheckIcon,
  DownloadIcon,
  ExternalIcon,
  GithubIcon,
  GlobeIcon,
  MonitorIcon,
  TerminalIcon,
  WindowsIcon,
  WrenchIcon,
} from "@/components/Icons";
import { type OSKey, PLATFORMS, detectArch, detectOS } from "@/lib/os";
import { LATEST_RELEASE, REACTOS, RELEASES, REPO, VERSION, ZIP } from "@/lib/links";
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
      <SectionHeading
        kicker="Download"
        title="Baixe e compile o toolchain Kyn"
        description="Analisamos o seu sistema operacional automaticamente e indicamos o melhor caminho. Nesta release alpha, o Kyn é distribuído como código-fonte: clone o repositório oficial e compile com Zig."
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
            sistemas, siga as instruções do cartão correspondente abaixo — e acompanhe as releases para
            novos binários e plataformas.
          </p>
        )}
      </div>

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
          O Kyn {VERSION} é um alpha experimental sem binários pré-compilados: a instalação é pelo
          código-fonte do repositório oficial, compilado com o Zig.
        </p>
        <div className="mt-5">
          <CodeBlock code={BUILD_SOURCE} lang="sh" title="terminal" />
        </div>
      </div>

      {/* ===== Plataformas ===== */}
      <div className="mt-14">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">Escolha a sua plataforma</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Linux, Windows, macOS e ReactOS — selecione abaixo caso a detecção automática não se aplique ao
          seu ambiente.
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
