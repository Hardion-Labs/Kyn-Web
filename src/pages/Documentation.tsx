import { useEffect, useState } from "react";
import CodeBlock from "@/components/CodeBlock";
import SectionHeading from "@/components/SectionHeading";
import { ExternalIcon, GithubIcon } from "@/components/Icons";
import { LATEST_RELEASE, REPO, RELEASES, VERSION, doc } from "@/lib/links";
import { cn } from "@/utils/cn";

const HELLO = `extern fn puts(s: *const u8) i32;

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

const SYNTAX = `fn double(n: i32) i32 {
    return n * 2;
}

fn main() i32 {
    let base: i32 = 21;          // let is immutable
    var total: i32 = double(base); // var is mutable

    if total > 40 {               // the condition must be bool
        total += 2;
    } else {
        total -= 2;
    }

    var i: i32 = 0;
    while i < 3 {
        i += 1;
    }
    return total;
}
`;

const POINTERS = `struct Point {
    x: i32,
    y: i32,
}

fn main() i32 {
    var p: Point = Point { x: 1, y: 2 };
    let q: *Point = &p;        // explicit mutable pointer
    q->x += 10;                // access through a pointer uses ->

    let r: *const Point = &p;  // read-only pointer
    let sum: i32 = q->x + p.y; // access on a value uses .
    return sum;
}
`;

const SLICES = `fn sum(s: []i32) i32 {
    var total: i32 = 0;
    var i: usize = 0;
    while i < s.len {
        total += s[i];   // index out of bounds: runtime trap
        i += 1;
    }
    return total;
}

fn main() i32 {
    var nums: [4]i32 = [4]i32 { 1, 2, 3, 4 };
    let slice: []i32 = &nums as []i32;
    let sub: []i32 = slice[1..3];  // subslice [start..end]
    return sum(sub);
}
`;

const C_ABI = `extern fn puts(s: *const u8) i32;  // calls C code

export fn answer() i32 {            // exposes Kyn to C
    return 42;
}
`;

const KYN_BUILD = `project "hybrid"

target "hybrid" {
    kind: "exe"
    sources: ["src/main.kyn"]
    c_sources: ["src/math.c"]
    zig_sources: ["zig/math.zig"]
    profile: "safe"
}
`;

const BUILD_STEPS = `# Clone the official repository and build the toolchain
git clone https://github.com/Hardion-Labs/Kyn.git
cd Kyn
zig build

# Run the example included in the repository
./zig-out/bin/kync run examples/hello.kyn

# Type-check only, without generating a binary
./zig-out/bin/kync check examples/hello.kyn

# Generate a native executable with the "safe" profile
./zig-out/bin/kync build examples/hello.kyn -o /tmp/kyn-hello --profile safe
/tmp/kyn-hello`;

const SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "first-program", label: "First program" },
  { id: "syntax", label: "Essential syntax" },
  { id: "pointers", label: "Pointers and memory" },
  { id: "slices", label: "Slices and arrays" },
  { id: "security", label: "Security profiles" },
  { id: "cli", label: "CLI: kync" },
  { id: "kyn-build", label: "kyn-build" },
  { id: "c-abi", label: "Interop with C (C ABI)" },
  { id: "diagnostics", label: "Diagnostics" },
  { id: "roadmap", label: "Roadmap" },
  { id: "resources", label: "Official resources" },
];

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-50 text-left">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-semibold text-zinc-900">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-zinc-200">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5 align-top text-zinc-600">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Sec({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-zinc-100 pb-12 last:border-0 last:pb-0">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-950">{title}</h2>
      <div className="doc mt-4 space-y-4 text-[15px] leading-relaxed text-zinc-600">{children}</div>
    </section>
  );
}

export default function Documentation() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-96px 0px -65% 0px" }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => {
    window.location.hash = `/documentation#${id}`;
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
      <SectionHeading
        kicker="Documentation"
        title="Learn Kyn from scratch"
        description={`Practical guide to the Kyn ${VERSION} language: installation, syntax, pointers, slices, security profiles and interoperability with C. All the content below reflects the official repository.`}
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="px-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Contents</p>
          <nav className="mt-3 space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className={cn(
                  "block w-full rounded-lg px-3 py-2 text-left text-sm transition",
                  active === s.id
                    ? "bg-zinc-100 font-semibold text-zinc-950"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                )}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 space-y-12">
          <Sec id="intro" title="Introduction">
            <p>
              <strong className="text-zinc-900">Kyn</strong> is a systems programming language from{" "}
              <a href="https://github.com/Hardion-Labs" target="_blank" rel="noreferrer" className="font-medium text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-2">
                Hardion Labs
              </a>{" "}
              focused on <em>explicit control</em>, <em>verifiable safety</em> and{" "}
              <em>predictable performance</em>. It was created for kernels, drivers, embedded systems,
              runtimes and high-performance native software.
            </p>
            <Table
              head={["Principle", "What it means"]}
              rows={[
                ["Explicit control", "Allocation, pointers, mutability and conversions are written in the source code. No hidden allocations or control flow."],
                ["Verifiable safety", "Compile-time checks for whatever can be proven; runtime checks are never silently removed."],
                ["Predictable performance", "No GC, no ownership inference, no implicit reference counting. The code has predictable machine costs."],
              ]}
            />
            <p>
              <strong className="text-zinc-900">Status:</strong> {VERSION} is a published preview under
              active development. Features listed as current limitations are <em>not</em> implemented — they
              are rejected with diagnostics instead of being compiled as undefined behavior.
            </p>
          </Sec>

          <Sec id="installation" title="Installation">
            <p>
              The toolchain (the <code>kync</code> compiler and the <code>kyn-build</code> build system) is written
              in Zig. Requirements:
            </p>
            <Table
              head={["Tool", "Version", "Note"]}
              rows={[
                ["Zig", "0.17.0", "Download at ziglang.org/download"],
                ["Clang", "recent", "With opaque-pointer LLVM IR support"],
                ["ar + POSIX shell", "—", "Available on the PATH"],
              ]}
            />
            <CodeBlock code={BUILD_STEPS} lang="sh" title="terminal" />
            <p>
              After <code>zig build</code>, the binaries are in <code>./zig-out/bin/</code>. Just want to
              download it? See the{" "}
              <a href="#/download" className="font-medium text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-2">
                Download
              </a>{" "}
              page, which detects your operating system (Linux, Windows or macOS) automatically.
            </p>
          </Sec>

          <Sec id="first-program" title="First program">
            <p>
              Save the code below as <code>hello.kyn</code> and run it with{" "}
              <code>./zig-out/bin/kync run hello.kyn</code>:
            </p>
            <CodeBlock code={HELLO} lang="kyn" title="hello.kyn" />
            <ul className="list-disc space-y-1.5 pl-5">
              <li><code>let</code> is immutable; <code>var</code> is mutable.</li>
              <li>Pointers are always explicit: <code>*T</code> and <code>*const T</code>.</li>
              <li>Field access through a pointer uses <code>-&gt;</code>; on values, it uses <code>.</code>.</li>
              <li>Conditions must be <code>bool</code>.</li>
              <li>Numeric conversions require <code>as</code>.</li>
            </ul>
          </Sec>

          <Sec id="syntax" title="Essential syntax">
            <p>
              Functions are declared with <code>fn</code> and an explicit return type; structs use{" "}
              <code>struct</code>; and control flow uses <code>if/else</code> and <code>while</code>, always
              with <code>bool</code> conditions and an explicit <code>return</code>:
            </p>
            <CodeBlock code={SYNTAX} lang="kyn" title="example.kyn" />
          </Sec>

          <Sec id="pointers" title="Pointers and memory">
            <p>
              In Kyn there is no reference inference: a pointer is declared in its type. Use{" "}
              <code>*T</code> for mutable pointers and <code>*const T</code> for read-only ones. The{" "}
              <code>&amp;</code> operator takes an address, <code>*p</code> dereferences, and{" "}
              <code>p-&gt;field</code> accesses fields through the pointer.
            </p>
            <CodeBlock code={POINTERS} lang="kyn" title="pointers.kyn" />
            <p>
              Dereferences of a known-null pointer (<code>*p</code>, <code>p-&gt;field</code>,{" "}
              <code>p[i]</code>) cause a <em>trap</em> at runtime — and likely-null dereferences are
              rejected at compile time with the code <code>E0506</code>.
            </p>
          </Sec>

          <Sec id="slices" title="Slices and arrays">
            <p>
              Fixed-size arrays are checked at runtime. Convert an array to a slice with{" "}
              <code>&amp;array as []T</code>, use <code>.len</code>, and take a subslice with{" "}
              <code>slice[start..end]</code>:
            </p>
            <CodeBlock code={SLICES} lang="kyn" title="slices.kyn" />
            <p>
              Out-of-bounds indices on fixed arrays or slices cause a runtime trap; slices can also be
              passed by value through the C ABI with the layout <code>{"struct { ptr, usize }"}</code>.
            </p>
          </Sec>

          <Sec id="security" title="Security profiles">
            <p>
              The compiler offers four profiles. None of them silently removes any implemented check — today
              the profiles only change native optimization:
            </p>
            <Table
              head={["Profile", "Native optimization", "Static analyzer", "Runtime checks"]}
              rows={[
                ["debug", "-O0 -g", "always on", "always on"],
                ["safe", "-O2", "always on", "always on"],
                ["release", "-O3", "always on", "always on"],
                ["fast", "-O3", "always on", "always on"],
              ]}
            />
            <p>Among the checks kept in every profile:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>bounds checks for fixed arrays and slices;</li>
              <li>overflow traps on <code>+</code>, <code>-</code>, <code>*</code> and unary <code>-</code>;</li>
              <li>division/remainder by zero traps (including <code>INT_MIN / -1</code>);</li>
              <li>out-of-range shift traps and null pointer dereference traps.</li>
            </ul>
            <p>
              In the static analysis: uninitialized reads, likely division by zero, constant overflow,
              out-of-range shifts, constant conditions and unreachable code.
            </p>
          </Sec>

          <Sec id="cli" title="CLI: kync">
            <p>
              <code>kync</code> is the compiler driver: it performs lexing, parsing, name resolution,
              type-checking and static analysis before emitting LLVM IR. Clang assembles and links that IR —
              the language semantics are implemented in the Kyn repository itself.
            </p>
            <Table
              head={["Command", "Description"]}
              rows={[
                ["kync check <file.kyn>", "Parse + type-check, without generating code"],
                ["kync emit-llvm <file.kyn>", "Emits the textual LLVM IR"],
                ["kync emit-obj <file.kyn>", "Emits a native object"],
                ["kync build <file.kyn> -o output --profile safe", "Generates a native executable"],
                ["kync run <file.kyn>", "Compiles and runs immediately"],
              ]}
            />
          </Sec>

          <Sec id="kyn-build" title="kyn-build — build system">
            <p>
              <code>kyn-build</code> manages mixed Kyn + C + Zig projects with content-addressed incremental
              builds, declared in <code>kyn.build</code> files:
            </p>
            <CodeBlock code={KYN_BUILD} lang="kyn" title="kyn.build" />
            <p>
              Run it with{" "}
              <code>./zig-out/bin/kyn-build --file examples/hybrid/kyn.build</code> — see the complete example
              in <code>examples/hybrid/</code> in the repository.
            </p>
          </Sec>

          <Sec id="c-abi" title="Interop with C (C ABI)">
            <p>
              Kyn and C can call each other through the C ABI on <code>x86_64 Linux</code>: use{" "}
              <code>extern fn</code> to declare C functions and <code>export fn</code> to expose Kyn functions
              to C:
            </p>
            <CodeBlock code={C_ABI} lang="kyn" title="abi.kyn" />
            <p>
              Scalars of all widths, pointers, bool and char are supported; aggregates up to 16
              bytes by value — classified leaf by leaf the way Clang classifies them, covering nested
              structs, fixed-array members, pointers, <code>i128</code> and SSE pairs — and slices by
              value as{" "}
              <code>{"struct { ptr, usize }"}</code>. <code>extern</code> declarations can be variadic
              (e.g. <code>printf</code>), and function values (<code>fn(P) R</code>) cross the boundary
              as plain pointers. Unsupported constructs are rejected with diagnostics
              (e.g. <code>E0410</code>, <code>E0473</code>) instead of becoming undefined behavior.
            </p>
          </Sec>

          <Sec id="diagnostics" title="Diagnostics">
            <p>
              Every compilation failure has a stable, documented code — for example,{" "}
              <code>E0506</code> indicates a likely null pointer dereference, rejected at compile time. See the
              full list in{" "}
              <a href={doc("diagnostics.md")} target="_blank" rel="noreferrer" className="font-medium text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-2">
                docs/diagnostics.md
              </a>
              .
            </p>
          </Sec>

          <Sec id="roadmap" title="Roadmap">
            <Table
              head={["Milestone", "Status"]}
              rows={[
                ["v0.1.0-alpha.5 — current main preview", "published"],
                ["Explicit codegen targets (--target), variadic extern, first-class function values", "delivered in v0.1.0-alpha.5"],
                ["Leaf-based System V aggregate classification; release installers", "delivered in v0.1.0-alpha.4"],
                ["match, tagged unions, unions, packed structs, bitfields, align(N)", "implemented on main, unreleased"],
                ["Package manifest; generics/traits; std lib and runtime", "planned"],
              ]}
            />
            <p>
              See the exact scope and delivery order in{" "}
              <a href={doc("roadmap.md")} target="_blank" rel="noreferrer" className="font-medium text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-2">
                docs/roadmap.md
              </a>
              .
            </p>
          </Sec>

          <Sec id="resources" title="Official resources">
            <ul className="space-y-3">
              {[
                [REPO, "Official repository — Hardion-Labs/Kyn", "source code, examples and releases"],
                [LATEST_RELEASE, `Release ${VERSION}`, "detailed notes for the current preview"],
                [RELEASES, "All releases", "history of the project's previews"],
                [doc("language-design.md"), "Language Design", "philosophy and design decisions"],
                [doc("language-reference.md"), "Language Reference", "syntax and semantics"],
                [doc("grammar.md"), "Grammar (EBNF)", "grammar and precedence"],
                [doc("type-system.md"), "Type System", "types and assignment rules"],
                [doc("memory-model.md"), "Memory Model", "memory, pointers and layout"],
                [doc("safety-model.md"), "Safety Model", "checks and undefined behavior"],
                [doc("abi.md"), "C ABI", "calling conventions and interop"],
                [doc("compiler-architecture.md"), "Compiler Architecture", "frontend, IR and backend"],
                [doc("build-system.md"), "Build System", "kyn-build and incremental builds"],
                [doc("diagnostics.md"), "Diagnostics", "stable diagnostic codes"],
                [doc("roadmap.md"), "Roadmap", "planned milestones"],
              ].map(([href, label, desc]) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-zinc-100"
                  >
                    <GithubIcon className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition group-hover:text-zinc-950" />
                    <span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-900">
                        {label}
                        <ExternalIcon className="h-3 w-3 text-zinc-400" />
                      </span>
                      <span className="mt-0.5 block text-xs text-zinc-500">{desc}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Sec>
        </div>
      </div>
    </div>
  );
}
