import { useEffect, useRef } from "react";

export const GeoJsonImport = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fileInput.current?.addEventListener("change", () => {});
  }, []);
  return (
    <dialog className="card absolute left-0 top-0 py-8 px-4 m-0 w-1/4">
      <h2 className="card-title">Import Trail</h2>
      <div className="divider">upload file</div>
      <input
        type="file"
        className="file-input file-input-bordered file-input-primary w-full"
        ref={fileInput}
      />
      <div className="divider">or paste geoJSON</div>
      <textarea />
    </dialog>
  );
};
