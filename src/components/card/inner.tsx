"use client";

import { CardProvider } from "@/components/card/context";

export const CardInner = ({ children }: { children: React.ReactNode }) => {
  return <CardProvider>{children}</CardProvider>;
};
