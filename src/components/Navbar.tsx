import { useState } from "react";
import { useVersions } from "@/hooks/useVersions";
import type { Route } from "@/lib/router";
import { REPO, VERSION } from "@/lib/links";
import { cn } from "@/utils/cn";
import { DownloadIcon, GithubIcon, KynLogo, MenuIcon, XIcon } from "./Icons";

const LINKS: { route: Route; label: string; hash: string }[] = [
  { route: "home", label: "Home", hash: "#/" },
  { route: "download", label: "Download", hash: "#/download" },
  { route: "documentation", label: "Documentation", hash: "#/documentation" },
];

export default function Navbar({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);
  const { latestVersion } = useVersions();
  const displayVersion = latestVersion ?? VERSION;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 p-1.5">
            <KynLogo className="h-full w-full text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-zinc-950">Kyn</span>
          <span className="hidden rounded-full border border-zinc-200 px-2 py-0.5 font-mono text-[11px] text-zinc-500 sm:inline">
            {displayVersion}
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.route}
              href={l.hash}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                route === l.route
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              )}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            aria-label="Official repository on GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
          <a href="#/download" className="btn-primary !px-3.5 !py-2">
            <DownloadIcon className="h-4 w-4" />
            Download
          </a>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-zinc-200 bg-white px-6 py-3 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.route}
              href={l.hash}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-medium",
                route === l.route ? "bg-zinc-100 text-zinc-950" : "text-zinc-600 hover:bg-zinc-100"
              )}
            >
              {l.label}
            </a>
          ))}
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
          >
            <GithubIcon className="h-4 w-4" /> Hardion-Labs/Kyn
          </a>
        </div>
      )}
    </header>
  );
}
