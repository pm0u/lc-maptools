"use client";
import { useDataLayers } from "@/hooks/data-layers";
import { useCallback, useEffect, useRef } from "react";
// @ts-expect-error
import toGeoJson from "@mapbox/togeojson";

export const FileImport = () => {
  const { addLayer } = useDataLayers();
  const fileInput = useRef<HTMLInputElement>(null);

  const onFileChange = useCallback(() => {
    if (fileInput.current) {
      const { files } = fileInput.current;
      if (files) {
        Array.from(files).forEach((file) => {
          const ext = file.name.split(".").pop();
          const parser = toGeoJson[ext];
          if (parser) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              const xml = new DOMParser().parseFromString(
                reader.result as string,
                "application/xml"
              );
              const geoJSON: GeoJSON.FeatureCollection = parser(xml);
              const id = geoJSON.features[0].properties?.name;
              addLayer({ id, layer: geoJSON });
            });
            reader.readAsText(file, "utf8");
          }
        });
      }
    }
  }, [addLayer]);

  useEffect(() => {
    const input = fileInput.current;
    input?.addEventListener("change", onFileChange);
    return () => {
      input?.removeEventListener("change", onFileChange);
    };
  }, [onFileChange]);
  return (
    <dialog className="card absolute left-20 top-0 py-8 px-4 w-1/4 m-0 drop-shadow-hover gap-4 pointer-events-auto">
      <h2 className="card-title">Import Path</h2>
      <div className="divider">Upload file</div>
      <input
        type="file"
        className="file-input file-input-bordered file-input-primary w-full"
        ref={fileInput}
      />
      <div className="divider">or paste geoJSON</div>
      <form className="flex flex-col gap-4">
        <textarea
          className="textarea textarea-primary"
          placeholder="GeoJSON..."
        />
        <button className="btn btn-primary">Import</button>
      </form>
    </dialog>
  );
};
