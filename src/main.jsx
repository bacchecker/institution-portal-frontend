import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter className="font-figtree">
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <App />
      </NextThemesProvider>
    </NextUIProvider>
  </BrowserRouter>
);
