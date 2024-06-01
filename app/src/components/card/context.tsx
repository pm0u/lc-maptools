import { createContext, useCallback, useContext, useMemo } from "react";
import mitt from "mitt";
import { useRouterWithHash } from "@/hooks/use-router-with-hash";

type CardEvents = {
  close: undefined;
};

type CardContextType = {
  /** Returns unsubscribe function */
  onClose: (fn: () => void) => () => void;
  close: () => void;
};

const CardContext = createContext<CardContextType>(
  // @ts-expect-error
  {}
);

const cardEvents = mitt<CardEvents>();

export const CardProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouterWithHash();

  const onClose = useCallback((fn: () => void) => {
    cardEvents.on("close", fn);
    return () => {
      cardEvents.off("close", fn);
    };
  }, []);

  const close = useCallback(() => {
    cardEvents.emit("close");
    router.push("/");
  }, [router]);

  const value = useMemo(() => ({ onClose, close }), [onClose, close]);

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};

export const useCardContext = () => {
  const ctx = useContext(CardContext);
  if (!ctx) throw Error("Card context must be used in a card!");
  return ctx;
};
