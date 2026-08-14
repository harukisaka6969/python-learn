import { useContext } from "react";
import { PyodideContext, type PyodideContextValue } from "./PyodideProvider";

export function usePyodide(): PyodideContextValue {
  const ctx = useContext(PyodideContext);
  if (!ctx) throw new Error("usePyodide must be used within a PyodideProvider");
  return ctx;
}
