"use client";
import { CloseButton } from "@/components/card/close-button";
import { useCardContext } from "@/components/card/context";

export const Close = () => {
  const { close } = useCardContext();
  return (
    <div className="flex items-center justify-end">
      <CloseButton onClose={close} />
    </div>
  );
};
