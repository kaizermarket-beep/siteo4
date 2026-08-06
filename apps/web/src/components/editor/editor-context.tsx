"use client";

import { createContext, useContext } from "react";
import { useStore } from "zustand";
import type { EditorStore } from "./editor-store";

const EditorStoreContext = createContext<EditorStore | null>(null);

export const EditorStoreProvider = EditorStoreContext.Provider;

export function useEditorStore<T>(selector: (state: ReturnType<EditorStore["getState"]>) => T): T {
  const store = useContext(EditorStoreContext);
  if (!store) throw new Error("useEditorStore must be used within EditorStoreProvider");
  return useStore(store, selector);
}
