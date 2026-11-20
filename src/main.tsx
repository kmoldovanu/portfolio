import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/geist-mono";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {/* Vercel Web Analytics: visite e provenienza, senza cookie. Si attiva dalla dashboard del progetto. */}
    <Analytics />
  </StrictMode>,
);
