import { createRoot } from "react-dom/client";
import App from "./App";
import { setupApi } from "./lib/api-mode";
import "./index.css";

setupApi().finally(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
