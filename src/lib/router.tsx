import { useCallback, useEffect, useState } from "react";

export type Route = "home" | "download" | "documentation";

export function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const seg = raw.split(/[#/?]/)[0].toLowerCase();
  if (seg === "download" || seg === "baixar") return "download";
  // Legacy Portuguese links (e.g. #/documentacao) keep working.
  if (seg === "documentation" || seg === "docs" || seg === "documentacao" || seg === "documentação") {
    return "documentation";
  }
  return "home";
}

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((r: Route, section?: string) => {
    window.location.hash = section ? `/${r}#${section}` : `/${r}`;
  }, []);

  return { route, navigate };
}
