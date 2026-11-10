import { HARDION_LABS, LATEST_RELEASE, REACTOS, REPO, RELEASES, VERSION } from "@/lib/links";
import { ExternalIcon, GithubIcon, Zap } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950">
              <Zap className="h-4 w-4 text-amber-400" />
            </span>
            <span className="text-lg font-bold tracking-tight text-zinc-950">Kyn</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-600">
            Linguagem de programação de sistemas da Hardion Labs. Controle explícito, segurança
            verificável e desempenho previsível — para kernels, drivers, embarcados e software nativo.
          </p>
          <p className="mt-4 font-mono text-xs text-zinc-500">{VERSION} · licença MIT · backend LLVM</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-950">Navegação</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
            <li><a className="transition hover:text-zinc-950" href="#/">Home</a></li>
            <li><a className="transition hover:text-zinc-950" href="#/download">Download</a></li>
            <li><a className="transition hover:text-zinc-950" href="#/documentacao">Documentação</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-950">Recursos oficiais</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-600">
            <li>
              <a href={REPO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-zinc-950">
                <GithubIcon className="h-4 w-4" /> Hardion-Labs/Kyn <ExternalIcon className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a href={RELEASES} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-zinc-950">
                Releases <ExternalIcon className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a href={LATEST_RELEASE} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-zinc-950">
                {VERSION} <ExternalIcon className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a href={REACTOS} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-zinc-950">
                reactos/reactos <ExternalIcon className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a href={HARDION_LABS} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition hover:text-zinc-950">
                Hardion Labs <ExternalIcon className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-zinc-500 sm:flex-row">
          <p>© 2026 Hardion Labs — Kyn é open source sob licença MIT.</p>
          <p className="font-mono">Engineered to the core.</p>
        </div>
      </div>
    </footer>
  );
}
