"use client";
import { IoClose } from "react-icons/io5";

export const CloseButton = ({
  onClose = () => {},
}: {
  onClose?: () => void;
}) => {
  return (
    <button className="btn btn-ghost btn-circle" onClick={onClose}>
      <IoClose className="h-8 w-auto" />
    </button>
  );
};
