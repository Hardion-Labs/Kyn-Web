import { useCallback, useEffect, useState } from "react";

export type Route = "home" | "download" | "documentacao";

export function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const seg = raw.split(/[#/?]/)[0].toLowerCase();
  if (seg === "download" || seg === "baixar") return "download";
  if (seg === "documentacao" || seg === "documentação" || seg === "docs") return "documentacao";
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
