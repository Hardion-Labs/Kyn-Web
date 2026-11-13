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
  SearchIcon,
  ShieldIcon,
  SlidersIcon,
} from "@/components/Icons";
import { useVersions } from "@/hooks/useVersions";
import { LATEST_RELEASE, REPO, VERSION, doc } from "@/lib/links";
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
  { value: "No GC", label: "explicit allocation, written in the source code" },
  { value: "4 profiles", label: "security profiles: debug, safe, release and fast" },
  { value: "LLVM", label: "native backend via textual IR" },
  { value: "C ABI", label: "direct interop with C on x86_64 Linux" },
  { value: "MIT", label: "open source license" },
  { value: VERSION, label: "published preview, evolving" },
];

const PILLARS = [
  {
    icon: SlidersIcon,
    title: "Explicit control",
    text: "Allocation, pointers, mutability and conversions appear in the source code. No hidden allocations or invisible control flow.",
  },
  {
    icon: ShieldIcon,
    title: "Verifiable safety",
    text: "Compile-time checks for whatever can be proven. Runtime checks, when they exist, are never silently removed.",
  },
  {
    icon: GaugeIcon,
    title: "Predictable performance",
    text: "No garbage collector, no ownership inference, no implicit reference counting. The source code carries predictable machine costs.",
  },
];

const DESIGN = [
  { code: "let / var", desc: "let is immutable; var is mutable." },
  { code: "*T e *const T", desc: "pointers are always explicit in the type." },
  { code: "p->field / p.field", desc: "-> on pointers, . on values." },
  { code: "condition: bool", desc: "conditionals require bool, with no coercions." },
  { code: "x as i64", desc: "numeric conversions require as." },
  { code: "relative import", desc: "deterministic imports with per-file namespaces." },
];

const FEATURES = [
  {
    icon: SearchIcon,
    title: "Static analysis",
    text: "Uninitialized reads, likely division by zero, constant overflow, out-of-range shifts and constant conditions are detected at compile time.",
  },
  {
    icon: FileIcon,
    title: "Diagnostics with stable codes",
    text: "Errors have documented codes (e.g., E0506 for a likely null dereference), with automated documentation coverage.",
  },
  {
    icon: ShieldIcon,
    title: "Runtime traps",
    text: "Array/slice bounds, arithmetic overflow, division by zero, invalid shifts and null pointer dereference — in every profile.",
  },
  {
    icon: BoxIcon,
    title: "kyn-build incremental",
    text: "Mixed Kyn + C + Zig projects with content-addressed incremental builds, via kyn.build files.",
  },
  {
    icon: LinkIcon,
    title: "C ABI nativa",
    text: "extern fn / export fn let you call and be called from C through the System V ABI on x86_64 Linux: scalars, aggregates up to 16 bytes, { ptr, usize } slices, variadic extern calls and function values.",
  },
  {
    icon: CheckIcon,
    title: "Integration tests",
    text: "End-to-end suite with positive and negative programs, the four security profiles and a deterministic corpus of 902 robustness cases.",
  },
];

const USECASES = [
  {
    icon: CpuIcon,
    title: "Kernels and drivers",
    text: "The core of the project: Kyn was born to write operating systems, drivers and low-level code with verifiable safety.",
  },
  {
    icon: BoxIcon,
    title: "Embedded systems",
    text: "No GC and no hidden runtime: the cost of every line is predictable, ideal for resource-constrained devices.",
  },
  {
    icon: LayersIcon,
    title: "Runtimes and VMs",
    text: "Direct interop with C and Zig makes Kyn a natural candidate for runtimes, interpreters and virtual machines.",
  },
  {
    icon: GaugeIcon,
    title: "High-performance native software",
    text: "LLVM backend with -O0 to -O3 profiles and checks that are never silently turned off.",
  },
  {
    icon: LinkIcon,
    title: "Bridge to legacy C code",
    text: "Call existing C libraries through the C ABI, with no hidden wrappers or runtime layers.",
  },
];

const TIMELINE = [
  {
    tag: "v0.1.0-alpha.2",
    status: "published",
    tone: "emerald" as const,
    text: "Verified core: lexer, parser, type checker, static analyzer, typed IR and LLVM backend. The kync CLI provides check, emit-llvm, emit-obj, build and run.",
  },
  {
    tag: "v0.1.0-alpha.3",
    status: "published",
    tone: "emerald" as const,
    text: "Extended C ABI (scalars, SSE, slices), const-polymorphic slicing ([..], [start..], [..end], .ptr, .len) and relative imports with aliases and per-module namespaces.",
  },
  {
    tag: "v0.1.0-alpha.4",
    status: "published",
    tone: "emerald" as const,
    text: "Leaf-based System V classification for nested structs, fixed arrays, pointer and 128-bit members, validated against Clang over 13,370 aggregate shapes; release archives with installers; i128/u128 constants.",
  },
  {
    tag: "v0.1.0-alpha.5",
    status: "current",
    tone: "amber" as const,
    text: "Explicit code-generation targets (kync --target <triple>), variadic extern declarations with C default argument promotions, and first-class function values with null-checked indirect calls.",
  },
  {
    tag: "In progress",
    status: "partial",
    tone: "yellow" as const,
    text: "Already on main: match over integers, bool and enums, tagged unions with payload binding, unions, packed structs, bitfields, align(N), anonymous members, variadic callees (va_arg) and exported globals.",
  },
  {
    tag: "Planned",
    status: "roadmap",
    tone: "zinc" as const,
    text: "Package manifest and module tooling, generics/traits, standard library and runtime, plus defer, for, closures and exceptions.",
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
              {VERSION} — published preview, under active development
            </div>
            <h1 className="mt-6 flex items-center gap-4 text-6xl font-extrabold tracking-tight text-zinc-950 sm:text-7xl">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 p-3 sm:h-16 sm:w-16 sm:p-3.5">
                <KynLogo className="h-full w-full text-white" />
              </span>
              Kyn
            </h1>
            <p className="mt-6 text-2xl font-semibold leading-snug text-zinc-900 sm:text-[1.7rem]">
              Explicit control. Verifiable safety. Predictable performance.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
              Kyn is a systems programming language from{" "}
              <span className="font-semibold text-zinc-900">Hardion Labs</span>, built for kernels,
              drivers, embedded systems, runtimes and high-performance native software. No GC and no
              hidden magic: every line of source code carries a predictable machine cost.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#/download" className="btn-primary !px-5 !py-3">
                <DownloadIcon className="h-4 w-4" />
                {latestVersion ? `Download ${latestVersion}` : "Download now"}
                <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a href="#/documentation" className="btn-secondary !px-5 !py-3">
                <BookIcon className="h-4 w-4" />
                Documentation
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
                Distribution catalog: <span className="font-semibold text-zinc-800">{latestRelease.version}</span>
                {" · "}
                {formatReleaseDate(latestRelease.releaseDate)}
                {latestPlatforms.length > 0 && ` · ${latestPlatforms.join(" / ")}`}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-zinc-500">
              <span>MIT license</span>
              <span>Zig 0.17.0</span>
              <span>backend LLVM</span>
              <span>x86_64 Linux validated</span>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <CodeBlock code={EXAMPLE} lang="kyn" title="examples/hello.kyn" />
            <p className="mt-3 text-center font-mono text-xs text-zinc-400">
              run with: ./zig-out/bin/kync run examples/hello.kyn
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

      {/* ============ POWER ============ */}
      <section id="poder" className="scroll-mt-24 border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <SectionHeading
            kicker="The power of Kyn"
            title="A language that hides nothing"
            description="Kyn favors explicitness over inference, likely correctness over convenience, and predictable code generation over hidden runtime machinery. Three principles define the project:"
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
              <h3 className="text-xl font-semibold text-zinc-950">Design choices visible in the code</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Every decision shows up in the source code. The example beside it is a real Kyn program from the
                official repository — and it already shows the philosophy of the language.
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

      {/* ============ POTENTIAL ============ */}
      <section id="potencial" className="scroll-mt-24 border-b border-zinc-100 bg-zinc-50/60">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <SectionHeading
            kicker="Potential"
            title="Where Kyn makes a difference"
            description="From operating system kernels to runtimes and embedded code: Kyn was designed for places where explicit control and predictable performance are requirements, not options."
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EVOLUTION ============ */}
      <section id="evolucao" className="scroll-mt-24 border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <SectionHeading
            kicker="Evolution"
            title="A language built in the open"
            description="Kyn is in alpha — and the roadmap is public. Each release expands the verified core without removing any implemented check."
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
            View the full roadmap in the repository <ExternalIcon className="h-3.5 w-3.5" />
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
              Ready to write predictable systems code?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
              Clone the official repository, build the toolchain with Zig and run your first Kyn program
              in minutes.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#/download" className="btn-amber !px-5 !py-3">
                <DownloadIcon className="h-4 w-4" />
                {latestVersion ? `Download Kyn ${latestVersion}` : "Download Kyn"}
              </a>
              <a
                href="#/documentation"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
              >
                <BookIcon className="h-4 w-4" />
                Read the documentation
              </a>
              <a
                href={LATEST_RELEASE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                <GithubIcon className="h-4 w-4" />
                {VERSION} on GitHub
                <ExternalIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
