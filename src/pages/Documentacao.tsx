import { useEffect, useState } from "react";
import CodeBlock from "@/components/CodeBlock";
import SectionHeading from "@/components/SectionHeading";
import { ExternalIcon, GithubIcon } from "@/components/Icons";
import { LATEST_RELEASE, REACTOS, REPO, RELEASES, VERSION, doc } from "@/lib/links";
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

const SYNTAX = `fn dobro(n: i32) i32 {
    return n * 2;
}

fn main() i32 {
    let base: i32 = 21;          // let é imutável
    var total: i32 = dobro(base); // var é mutável

    if total > 40 {               // condição deve ser bool
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
    let q: *Point = &p;        // ponteiro mutável explícito
    q->x += 10;                // acesso via ponteiro usa ->

    let r: *const Point = &p;  // ponteiro somente leitura
    let soma: i32 = q->x + p.y; // acesso em valor usa .
    return soma;
}
`;

const SLICES = `fn soma(s: []i32) i32 {
    var total: i32 = 0;
    var i: usize = 0;
    while i < s.len {
        total += s[i];   // índice fora do limite: trap em runtime
        i += 1;
    }
    return total;
}

fn main() i32 {
    var nums: [4]i32 = [4]i32 { 1, 2, 3, 4 };
    let fatia: []i32 = &nums as []i32;
    let sub: []i32 = fatia[1..3];  // subslice [start..end]
    return soma(sub);
}
`;

const C_ABI = `extern fn puts(s: *const u8) i32;  // chama código C

export fn answer() i32 {            // expõe Kyn para C
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

const BUILD_STEPS = `# Clone o repositório oficial e compile o toolchain
git clone https://github.com/Hardion-Labs/Kyn.git
cd Kyn
zig build

# Rode o exemplo incluído no repositório
./zig-out/bin/kync run examples/hello.kyn

# Apenas type-check, sem gerar binário
./zig-out/bin/kync check examples/hello.kyn

# Gere um executável nativo com o perfil "safe"
./zig-out/bin/kync build examples/hello.kyn -o /tmp/kyn-hello --profile safe
/tmp/kyn-hello`;

const SECTIONS = [
  { id: "intro", label: "Introdução" },
  { id: "instalacao", label: "Instalação" },
  { id: "primeiro-programa", label: "Primeiro programa" },
  { id: "sintaxe", label: "Sintaxe essencial" },
  { id: "ponteiros", label: "Ponteiros e memória" },
  { id: "slices", label: "Slices e arrays" },
  { id: "seguranca", label: "Perfis de segurança" },
  { id: "cli", label: "CLI: kync" },
  { id: "kyn-build", label: "kyn-build" },
  { id: "c-abi", label: "Interop com C (C ABI)" },
  { id: "diagnosticos", label: "Diagnósticos" },
  { id: "roadmap", label: "Roadmap" },
  { id: "recursos", label: "Recursos oficiais" },
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

export default function Documentacao() {
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
    window.location.hash = `/documentacao#${id}`;
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
      <SectionHeading
        kicker="Documentação"
        title="Aprenda Kyn do zero"
        description={`Guia prático da linguagem Kyn ${VERSION}: instalação, sintaxe, ponteiros, slices, perfis de segurança e interoperabilidade com C. Todo o conteúdo abaixo reflete o repositório oficial.`}
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="px-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">Conteúdo</p>
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

        {/* Conteúdo */}
        <div className="min-w-0 space-y-12">
          <Sec id="intro" title="Introdução">
            <p>
              <strong className="text-zinc-900">Kyn</strong> é uma linguagem de programação de sistemas da{" "}
              <a href="https://github.com/Hardion-Labs" target="_blank" rel="noreferrer" className="font-medium text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-2">
                Hardion Labs
              </a>{" "}
              focada em <em>controle explícito</em>, <em>segurança verificável</em> e{" "}
              <em>desempenho previsível</em>. Ela foi criada para kernels, drivers, sistemas embarcados,
              runtimes e software nativo de alto desempenho.
            </p>
            <Table
              head={["Princípio", "O que significa"]}
              rows={[
                ["Controle explícito", "Alocação, ponteiros, mutabilidade e conversões são escritos no código-fonte. Nada de alocações ou fluxo de controle escondidos."],
                ["Segurança verificável", "Checagens em tempo de compilação para o que pode ser provado; checagens em runtime nunca são removidas silenciosamente."],
                ["Desempenho previsível", "Sem GC, sem inferência de ownership, sem contagem de referências implícita. O código gera custos de máquina previsíveis."],
              ]}
            />
            <p>
              <strong className="text-zinc-900">Status:</strong> {VERSION} é uma preview publicada e em
              desenvolvimento ativo. Recursos listados como limitações atuais <em>não</em> estão
              implementados — e são rejeitados com diagnósticos em vez de compilados como comportamento
              indefinido.
            </p>
          </Sec>

          <Sec id="instalacao" title="Instalação">
            <p>
              O toolchain (compilador <code>kync</code> e sistema de build <code>kyn-build</code>) é escrito
              em Zig. Requisitos:
            </p>
            <Table
              head={["Ferramenta", "Versão", "Observação"]}
              rows={[
                ["Zig", "0.17.0", "Download em ziglang.org/download"],
                ["Clang", "recente", "Com suporte a opaque-pointer LLVM IR"],
                ["ar + shell POSIX", "—", "Disponíveis na PATH"],
              ]}
            />
            <CodeBlock code={BUILD_STEPS} lang="sh" title="terminal" />
            <p>
              Após o <code>zig build</code>, os binários ficam em <code>./zig-out/bin/</code>. Quer apenas
              baixar? Veja a página de{" "}
              <a href="#/download" className="font-medium text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-2">
                Download
              </a>
              , que detecta seu sistema operacional (Linux, Windows, macOS ou ReactOS) automaticamente.
            </p>
          </Sec>

          <Sec id="primeiro-programa" title="Primeiro programa">
            <p>
              Salve o código abaixo como <code>hello.kyn</code> e execute com{" "}
              <code>./zig-out/bin/kync run hello.kyn</code>:
            </p>
            <CodeBlock code={HELLO} lang="kyn" title="hello.kyn" />
            <ul className="list-disc space-y-1.5 pl-5">
              <li><code>let</code> é imutável; <code>var</code> é mutável.</li>
              <li>Ponteiros são sempre explícitos: <code>*T</code> e <code>*const T</code>.</li>
              <li>Acesso a campos via ponteiro usa <code>-&gt;</code>; em valores, usa <code>.</code>.</li>
              <li>Condições devem ser <code>bool</code>.</li>
              <li>Conversões numéricas exigem <code>as</code>.</li>
            </ul>
          </Sec>

          <Sec id="sintaxe" title="Sintaxe essencial">
            <p>
              Funções são declaradas com <code>fn</code> e tipo de retorno explícito; estruturas com{" "}
              <code>struct</code>; e o fluxo de controle usa <code>if/else</code> e <code>while</code>, sempre
              com condições <code>bool</code> e <code>return</code> explícito:
            </p>
            <CodeBlock code={SYNTAX} lang="kyn" title="exemplo.kyn" />
          </Sec>

          <Sec id="ponteiros" title="Ponteiros e memória">
            <p>
              Em Kyn não existe inferência de referências: um ponteiro é declarado no tipo. Use{" "}
              <code>*T</code> para ponteiros mutáveis e <code>*const T</code> para somente leitura. O
              operador <code>&amp;</code> obtém o endereço, <code>*p</code> desreferencia e{" "}
              <code>p-&gt;campo</code> acessa campos através do ponteiro.
            </p>
            <CodeBlock code={POINTERS} lang="kyn" title="pointers.kyn" />
            <p>
              Desreferências de ponteiro nulo exato (<code>*p</code>, <code>p-&gt;campo</code>,{" "}
              <code>p[i]</code>) causam <em>trap</em> em runtime — e desreferências nulas prováveis são
              rejeitadas em tempo de compilação com o código <code>E0506</code>.
            </p>
          </Sec>

          <Sec id="slices" title="Slices e arrays">
            <p>
              Arrays de tamanho fixo são verificados em runtime. Converta um array para slice com{" "}
              <code>&amp;array as []T</code>, use <code>.len</code> e faça subslicing com{" "}
              <code>slice[start..end]</code>:
            </p>
            <CodeBlock code={SLICES} lang="kyn" title="slices.kyn" />
            <p>
              Índices fora dos limites de array fixo ou slice causam trap em runtime; slices também
              podem ser passadas por valor pela C ABI com layout <code>{"struct { ptr, usize }"}</code>.
            </p>
          </Sec>

          <Sec id="seguranca" title="Perfis de segurança">
            <p>
              O compilador oferece quatro perfis. Nenhum deles remove silenciosamente qualquer verificação
              implementada — hoje os perfis alteram apenas a otimização nativa:
            </p>
            <Table
              head={["Perfil", "Otimização nativa", "Analisador estático", "Verificações em runtime"]}
              rows={[
                ["debug", "-O0 -g", "sempre ligado", "sempre ligadas"],
                ["safe", "-O2", "sempre ligado", "sempre ligadas"],
                ["release", "-O3", "sempre ligado", "sempre ligadas"],
                ["fast", "-O3", "sempre ligado", "sempre ligadas"],
              ]}
            />
            <p>Entre as verificações mantidas em todos os perfis:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>limites de arrays fixos e slices;</li>
              <li>traps de overflow em <code>+</code>, <code>-</code>, <code>*</code> e <code>-</code> unário;</li>
              <li>traps de divisão/resto por zero (incluindo <code>INT_MIN / -1</code>);</li>
              <li>traps de shift fora de faixa e de desreferência de ponteiro nulo.</li>
            </ul>
            <p>
              Na análise estática: leituras não inicializadas, divisão por zero provável, overflow
              constante, shifts fora de faixa, condições constantes e código inalcançável.
            </p>
          </Sec>

          <Sec id="cli" title="CLI: kync">
            <p>
              O <code>kync</code> é o driver do compilador: faz lexing, parsing, resolução de nomes,
              type-check e análise estática antes de emitir LLVM IR. O Clang monta e linka esse IR — a
              semântica da linguagem é implementada no próprio repositório do Kyn.
            </p>
            <Table
              head={["Comando", "Descrição"]}
              rows={[
                ["kync check <arquivo.kyn>", "Parse + type-check, sem gerar código"],
                ["kync emit-llvm <arquivo.kyn>", "Emite o LLVM IR textual"],
                ["kync emit-obj <arquivo.kyn>", "Emite objeto nativo"],
                ["kync build <arquivo.kyn> -o saida --profile safe", "Gera um executável nativo"],
                ["kync run <arquivo.kyn>", "Compila e executa imediatamente"],
              ]}
            />
          </Sec>

          <Sec id="kyn-build" title="kyn-build — sistema de build">
            <p>
              O <code>kyn-build</code> gerencia projetos mistos Kyn + C + Zig com builds incrementais
              content-addressed, declarados em arquivos <code>kyn.build</code>:
            </p>
            <CodeBlock code={KYN_BUILD} lang="kyn" title="kyn.build" />
            <p>
              Execute com{" "}
              <code>./zig-out/bin/kyn-build --file examples/hybrid/kyn.build</code> — veja o exemplo
              completo em <code>examples/hybrid/</code> no repositório.
            </p>
          </Sec>

          <Sec id="c-abi" title="Interop com C (C ABI)">
            <p>
              Kyn e C podem chamar um ao outro através da C ABI em <code>x86_64 Linux</code>: use{" "}
              <code>extern fn</code> para declarar funções de C e <code>export fn</code> para expor funções
              Kyn a C:
            </p>
            <CodeBlock code={C_ABI} lang="kyn" title="abi.kyn" />
            <p>
              São suportados escalares de todas as larguras, ponteiros, bool e char; agregados
              integer-like de até 16 bytes por valor; e slices por valor como{" "}
              <code>{"struct { ptr, usize }"}</code>. Construções não suportadas são rejeitadas com
              diagnósticos (ex.: <code>E0410</code>, <code>E0473</code>) em vez de virarem comportamento
              indefinido.
            </p>
          </Sec>

          <Sec id="diagnosticos" title="Diagnósticos">
            <p>
              Toda falha de compilação tem um código estável e documentado — por exemplo,{" "}
              <code>E0506</code> indica uma desreferência de ponteiro nulo provável, rejeitada em tempo de
              compilação. Consulte a lista completa em{" "}
              <a href={doc("diagnostics.md")} target="_blank" rel="noreferrer" className="font-medium text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-2">
                docs/diagnostics.md
              </a>
              .
            </p>
          </Sec>

          <Sec id="roadmap" title="Roadmap">
            <Table
              head={["Marco", "Status"]}
              rows={[
                ["v0.1.0-alpha.3 — preview principal atual", "publicada"],
                ["C ABI ampliada (escalares, SSE, slices)", "entregue em v0.1.0-alpha.3"],
                ["Slicing const-polimórfico ([..], [start..], [..end], .ptr, .len)", "entregue em v0.1.0-alpha.3"],
                ["Imports relativos com aliases e namespaces", "entregue em v0.1.0-alpha.3"],
                ["Casos SSE de agregados mistos na C ABI", "parcial"],
                ["Módulos e manifesto de pacote; genéricos/traits; std lib e runtime", "planejado"],
              ]}
            />
            <p>
              Veja o escopo exato e a ordem das entregas em{" "}
              <a href={doc("roadmap.md")} target="_blank" rel="noreferrer" className="font-medium text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-2">
                docs/roadmap.md
              </a>
              .
            </p>
          </Sec>

          <Sec id="recursos" title="Recursos oficiais">
            <ul className="space-y-3">
              {[
                [REPO, "Repositório oficial — Hardion-Labs/Kyn", "código-fonte, exemplos e releases"],
                [LATEST_RELEASE, `Release ${VERSION}`, "notas detalhadas da preview atual"],
                [RELEASES, "Todas as releases", "histórico de previews do projeto"],
                [doc("language-design.md"), "Language Design", "filosofia e decisões de design"],
                [doc("language-reference.md"), "Language Reference", "sintaxe e semântica"],
                [doc("grammar.md"), "Grammar (EBNF)", "gramática e precedência"],
                [doc("type-system.md"), "Type System", "tipos e regras de atribuição"],
                [doc("memory-model.md"), "Memory Model", "memória, ponteiros e layout"],
                [doc("safety-model.md"), "Safety Model", "verificações e comportamento indefinido"],
                [doc("abi.md"), "C ABI", "convenções de chamada e interop"],
                [doc("compiler-architecture.md"), "Compiler Architecture", "frontend, IR e backend"],
                [doc("build-system.md"), "Build System", "kyn-build e builds incrementais"],
                [doc("diagnostics.md"), "Diagnostics", "códigos de diagnóstico estáveis"],
                [doc("roadmap.md"), "Roadmap", "marcos planejados"],
                [REACTOS, "reactos/reactos", "SO open source compatível com Windows — alvo natural de Kyn"],
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
