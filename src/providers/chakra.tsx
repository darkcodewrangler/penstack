"use client";

import { ChakraProvider as BaseChakraProvider } from "@chakra-ui/react";
import { chakraTheme } from "../lib/chakra-theme";

export function ChakraProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseChakraProvider theme={chakraTheme}>{children}</BaseChakraProvider>
  );
}
