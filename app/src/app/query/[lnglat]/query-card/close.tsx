"use client";
import { IoClose } from "react-icons/io5";
import { useCallback } from "react";
import { useRouterWithHash } from "@/hooks/use-router-with-hash";

export const Close = () => {
  const router = useRouterWithHash();
  const onClose = useCallback(() => {
    router.push("/");
  }, [router]);
  return (
    <div className="flex items-center justify-end">
      <button className="btn btn-ghost btn-circle" onClick={onClose}>
        <IoClose className="h-8 w-auto" />
      </button>
    </div>
  );
};
