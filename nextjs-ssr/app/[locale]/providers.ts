"use client";
import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/tanstack/queryClient";
import { ThemeProvider } from "@/context/theme-context";
export function Providers({ children }: { children: React.ReactNode }) {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(ThemeProvider, null, children),
  );
}
