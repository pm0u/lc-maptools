"use client";
import { useEffect, useRef } from "react";

export const FileImport = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fileInput.current?.addEventListener("change", () => {});
  }, []);
  return (
    <dialog className="card absolute right-0 top-0 py-8 px-4 w-1/3 m-0 left-auto drop-shadow-hover">
      <h2 className="card-title">Import Path</h2>
      <div className="divider py-4">Upload file</div>
      <input
        type="file"
        className="file-input file-input-bordered file-input-primary w-full"
        ref={fileInput}
      />
      <div className="divider py-4">or paste geoJSON</div>

      <textarea
        className="textarea textarea-primary"
        placeholder="GeoJSON..."
      />
    </dialog>
  );
};
