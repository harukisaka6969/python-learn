import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/tokens.css";
import "./styles/global.css";
import App from "./App";
import { PyodideProvider } from "./pyodide/PyodideProvider";
import { ProgressProvider } from "./progress/ProgressProvider";
import { CHAPTERS } from "./content/index";
import { validateContent } from "./utils/validateContent";

if (import.meta.env.DEV) {
  const issues = validateContent(CHAPTERS);
  if (issues.length > 0) {
    console.error("[validateContent] コンテンツに問題があります:", issues);
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PyodideProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </PyodideProvider>
    </BrowserRouter>
  </StrictMode>
);
