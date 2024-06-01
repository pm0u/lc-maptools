"use client";
import { IoClose } from "react-icons/io5";
import { useCardContext } from "@/components/card/context";

export const Close = () => {
  const { close } = useCardContext();
  return (
    <div className="flex items-center justify-end">
      <button className="btn btn-ghost btn-circle" onClick={close}>
        <IoClose className="h-8 w-auto" />
      </button>
    </div>
  );
};
