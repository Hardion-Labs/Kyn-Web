import CodeBlock from "@/components/CodeBlock";
import SectionHeading from "@/components/SectionHeading";
import {
  ArrowRightIcon,
  BookIcon,
  BoxIcon,
  CheckIcon,
  CpuIcon,
  DownloadIcon,
  ExternalIcon,
  FileIcon,
  GaugeIcon,
  GithubIcon,
  KynLogo,
  LayersIcon,
  LinkIcon,
  MonitorIcon,
  SearchIcon,
  ShieldIcon,
  SlidersIcon,
} from "@/components/Icons";
import { useVersions } from "@/hooks/useVersions";
import { LATEST_RELEASE, REACTOS, REPO, VERSION, doc } from "@/lib/links";
import { formatPlatformName, formatReleaseDate } from "@/services/versions.service";

const EXAMPLE = `extern fn puts(s: *const u8) i32;

struct Point {
    x: i32,
    y: i32,
}

fn sum(p: *Point) i32 {
    return p->x + p->y;
}

fn main() i32 {
    var p: Point = Point { x: 10, y: 20 };
    let q: *Point = &p;
    q->x += 5;
    puts("explicit, checked, native");
    return sum(q) - 30;
}
`;

const STATS = [
  { value: "Sem GC", label: "alocação explícita, escrita no código-fonte" },
  { value: "4 perfis", label: "de segurança: debug, safe, release e fast" },
  { value: "LLVM", label: "backend nativo via IR textual" },
  { value: "C ABI", label: "interop direta com C em x86_64 Linux" },
  { value: "MIT", label: "licença open source" },
  { value: VERSION, label: "preview publicada e em evolução" },
];

const PILLARS = [
  {
    icon: SlidersIcon,
    title: "Controle explícito",
    text: "Alocação, ponteiros, mutabilidade e conversões aparecem no código-fonte. Nada de alocações ocultas ou fluxo de controle invisível.",
  },
  {
    icon: ShieldIcon,
    title: "Segurança verificável",
    text: "Verificações em tempo de compilação para o que pode ser provado. Verificações em runtime, quando existem, nunca são removidas silenciosamente.",
  },
  {
    icon: GaugeIcon,
    title: "Desempenho previsível",
    text: "Sem coletor de lixo, sem inferência de ownership, sem contagem de referências implícita. O código-fonte carrega custos de máquina previsíveis.",
  },
];

const DESIGN = [
  { code: "let / var", desc: "let é imutável; var é mutável." },
  { code: "*T e *const T", desc: "ponteiros são sempre explícitos no tipo." },
  { code: "p->campo / p.campo", desc: "-> em ponteiros, . em valores." },
  { code: "condição: bool", desc: "condicionais exigem bool, sem coerções." },
  { code: "x as i64", desc: "conversões numéricas exigem as." },
  { code: "import relativo", desc: "imports determinísticos com namespaces por arquivo." },
];

const FEATURES = [
  {
    icon: SearchIcon,
    title: "Análise estática",
    text: "Leituras não inicializadas, divisão por zero provável, overflow constante, shifts fora de faixa e condições constantes são detectados na compilação.",
  },
  {
    icon: FileIcon,
    title: "Diagnósticos com códigos estáveis",
    text: "Erros têm códigos documentados (ex.: E0506 para desreferência nula provável), com cobertura de documentação automatizada.",
  },
  {
    icon: ShieldIcon,
    title: "Traps em runtime",
    text: "Limites de array/slice, overflow aritmético, divisão por zero, shifts inválidos e desreferência de ponteiro nulo — em todos os perfis.",
  },
  {
    icon: BoxIcon,
    title: "kyn-build incremental",
    text: "Projetos mistos Kyn + C + Zig com builds incrementais content-addressed, via arquivos kyn.build.",
  },
  {
    icon: LinkIcon,
    title: "C ABI nativa",
    text: "extern fn / export fn permitem chamar e ser chamado por C na ABI System V de x86_64 Linux, incluindo slices { ptr, usize }.",
  },
  {
    icon: CheckIcon,
    title: "Testes de integração",
    text: "Suíte end-to-end com programas positivos/negativos, os quatro perfis de segurança e um corpus determinístico de 900 casos de robustez.",
  },
];

const USECASES = [
  {
    icon: CpuIcon,
    title: "Kernels e drivers",
    text: "O núcleo do projeto: Kyn nasceu para escrever sistemas operacionais, drivers e código de baixo nível com segurança verificável.",
  },
  {
    icon: BoxIcon,
    title: "Sistemas embarcados",
    text: "Sem GC e sem runtime oculto: o custo de cada linha é previsível, ideal para dispositivos com recursos limitados.",
  },
  {
    icon: LayersIcon,
    title: "Runtimes e VMs",
    text: "Interop direta com C e Zig torna Kyn uma candidata natural para runtimes, interpretadores e máquinas virtuais.",
  },
  {
    icon: GaugeIcon,
    title: "Software nativo de alta performance",
    text: "Backend LLVM com perfis -O0 a -O3 e verificações que nunca são desligadas silenciosamente.",
  },
  {
    icon: LinkIcon,
    title: "Ponte com código legado em C",
    text: "Chame bibliotecas C existentes através da C ABI, sem wrappers escondidos nem camadas de runtime.",
  },
  {
    icon: MonitorIcon,
    title: "ReactOS",
    text: "Um kernel open source compatível com Windows é exatamente o tipo de alvo para o qual Kyn foi projetada.",
    href: REACTOS,
    hrefLabel: "github.com/reactos/reactos",
  },
];

const TIMELINE = [
  {
    tag: "v0.1.0-alpha.2",
    status: "publicada",
    tone: "emerald" as const,
    text: "Núcleo verificado: lexer, parser, type checker, analisador estático, IR tipada e backend LLVM. CLI kync com check, emit-llvm, emit-obj, build e run.",
  },
  {
    tag: "v0.1.0-alpha.3",
    status: "atual",
    tone: "amber" as const,
    text: "C ABI ampliada (escalares, SSE, slices), slicing const-polimórfico ([..], [start..], [..end], .ptr, .len) e imports relativos com aliases e namespaces por módulo.",
  },
  {
    tag: "Em andamento",
    status: "parcial",
    tone: "yellow" as const,
    text: "Casos SSE de agregados mistos na C ABI e a política explícita de verificações mantidas em todos os perfis de compilação.",
  },
  {
    tag: "Planejado",
    status: "roadmap",
    tone: "zinc" as const,
    text: "Módulos e manifesto de pacote, genéricos/traits, standard library e runtime, além de defer, for, switch/match, closures e exceções.",
  },
];

const TONE: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  yellow: "bg-yellow-100 text-yellow-800",
  zinc: "bg-zinc-100 text-zinc-600",
};

export default function Home() {
  const { latestRelease, latestVersion } = useVersions();
  const latestPlatforms = latestRelease
    ? Array.from(new Set(latestRelease.downloads.map((d) => formatPlatformName(d.platform))))
    : [];

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-zinc-100 bg-gradient-to-b from-zinc-50 via-white to-white">
        <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-24">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
              <KynLogo className="h-3.5 w-3.5" />
              {VERSION} — preview publicada, em desenvolvimento ativo
            </div>
            <h1 className="mt-6 flex items-center gap-4 text-6xl font-extrabold tracking-tight text-zinc-950 sm:text-7xl">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 p-3 sm:h-16 sm:w-16 sm:p-3.5">
                <KynLogo className="h-full w-full text-white" />
              </span>
              Kyn
            </h1>
            <p className="mt-6 text-2xl font-semibold leading-snug text-zinc-900 sm:text-[1.7rem]">
              Controle explícito. Segurança verificável. Desempenho previsível.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
              Kyn é uma linguagem de programação de sistemas da{" "}
              <span className="font-semibold text-zinc-900">Hardion Labs</span>, criada para kernels,
              drivers, sistemas embarcados, runtimes e software nativo de alto desempenho. Sem GC e sem
              mágica oculta: cada linha do código-fonte carrega um custo de máquina previsível.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#/download" className="btn-primary !px-5 !py-3">
                <DownloadIcon className="h-4 w-4" />
                {latestVersion ? `Baixar ${latestVersion}` : "Baixar agora"}
                <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a href="#/documentacao" className="btn-secondary !px-5 !py-3">
                <BookIcon className="h-4 w-4" />
                Documentação
              </a>
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
              >
                <GithubIcon className="h-5 w-5" />
                GitHub
                <ExternalIcon className="h-3.5 w-3.5" />
              </a>
            </div>
            {latestRelease && (
              <p className="mt-4 font-mono text-xs text-zinc-500">
                Catálogo de distribuição: <span className="font-semibold text-zinc-800">{latestRelease.version}</span>
                {" · "}
                {formatReleaseDate(latestRelease.releaseDate)}
                {latestPlatforms.length > 0 && ` · ${latestPlatforms.join(" / ")}`}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-zinc-500">
              <span>licença MIT</span>
              <span>Zig 0.17.0</span>
              <span>backend LLVM</span>
              <span>x86_64 Linux validado</span>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <CodeBlock code={EXAMPLE} lang="kyn" title="examples/hello.kyn" />
            <p className="mt-3 text-center font-mono text-xs text-zinc-400">
              rode com: ./zig-out/bin/kync run examples/hello.kyn
            </p>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-3 lg:grid-cols-6">
            {STATS.map((s) => (
              <div key={s.value} className="bg-white p-5">
                <p className="truncate text-lg font-bold text-zinc-950">{s.value}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PODER ============ */}
      <section id="poder" className="scroll-mt-24 border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <SectionHeading
            kicker="O poder de Kyn"
            title="Uma linguagem que não esconde nada"
            description="Kyn favorece a explicitidade sobre a inferência, a correção provável sobre a conveniência e a geração de código previsível sobre máquinas de runtime ocultas. Três princípios definem o projeto:"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-zinc-950">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-zinc-950">Escolhas de design visíveis no código</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Cada decisão aparece no código-fonte. O exemplo ao lado mostra um programa Kyn real do
                repositório oficial — e nele já dá para ver a filosofia da linguagem.
              </p>
              <ul className="mt-6 space-y-3">
                {DESIGN.map((d) => (
                  <li key={d.code} className="flex items-start gap-3">
                    <code className="mt-0.5 shrink-0 rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs font-medium text-zinc-900">
                      {d.code}
                    </code>
                    <span className="text-sm text-zinc-600">{d.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <CodeBlock code={EXAMPLE} lang="kyn" title="examples/hello.kyn" className="self-start shadow-none" />
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-zinc-100 bg-zinc-50/60 p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-zinc-700 ring-1 ring-zinc-200">
                  <f.icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-zinc-950">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POTENCIAL ============ */}
      <section id="potencial" className="scroll-mt-24 border-b border-zinc-100 bg-zinc-50/60">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <SectionHeading
            kicker="Potencial"
            title="Onde Kyn faz a diferença"
            description="De kernels de sistemas operacionais a runtimes e código embarcado: Kyn foi desenhada para os lugares onde o controle explícito e o desempenho previsível são requisitos, não opções."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {USECASES.map((u) => (
              <div
                key={u.title}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-amber-400">
                  <u.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-zinc-950">{u.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{u.text}</p>
                {u.href && (
                  <a
                    href={u.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 transition hover:text-zinc-950"
                  >
                    {u.hrefLabel} <ExternalIcon className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EVOLUÇÃO ============ */}
      <section id="evolucao" className="scroll-mt-24 border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <SectionHeading
            kicker="Evolução"
            title="Uma linguagem em construção transparente"
            description="Kyn está em alpha — e o roadmap é público. Cada release amplia o núcleo verificado sem remover nenhuma verificação implementada."
          />
          <ol className="relative mt-12 ml-2 border-l border-zinc-200 pl-8">
            {TIMELINE.map((t) => (
              <li key={t.tag} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[37px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-zinc-950 ring-1 ring-zinc-200" />
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-mono text-base font-semibold text-zinc-950">{t.tag}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONE[t.tone]}`}>
                    {t.status}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">{t.text}</p>
              </li>
            ))}
          </ol>
          <a
            href={doc("roadmap.md")}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost mt-8 !px-0 font-medium text-zinc-900"
          >
            Ver o roadmap completo no repositório <ExternalIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute -top-20 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl" />
            <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 p-2.5">
              <KynLogo className="h-full w-full text-zinc-950" />
            </span>
            <h2 className="relative mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para escrever código de sistema previsível?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
              Clone o repositório oficial, compile o toolchain com Zig e rode seu primeiro programa Kyn
              em minutos.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#/download" className="btn-amber !px-5 !py-3">
                <DownloadIcon className="h-4 w-4" />
                {latestVersion ? `Baixar o Kyn ${latestVersion}` : "Baixar o Kyn"}
              </a>
              <a
                href="#/documentacao"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
              >
                <BookIcon className="h-4 w-4" />
                Ler a documentação
              </a>
              <a
                href={LATEST_RELEASE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                <GithubIcon className="h-4 w-4" />
                {VERSION} no GitHub
                <ExternalIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
