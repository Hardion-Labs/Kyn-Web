import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Documentation from "@/pages/Documentation";
import Download from "@/pages/Download";
import Home from "@/pages/Home";
import { useHashRoute } from "@/lib/router";

export default function App() {
  const { route } = useHashRoute();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route]);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900">
      <Navbar route={route} />
      <main className="flex-1">
        {route === "home" && <Home />}
        {route === "download" && <Download />}
        {route === "documentation" && <Documentation />}
      </main>
      <Footer />
    </div>
  );
}
