import { useDataLayers } from "@/contexts/data-layers";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
// @ts-expect-error
import toGeoJson from "@mapbox/togeojson";
import { useRouter } from "next/navigation";
import { Card } from "@/components/card";

export const FileImport = () => {
  const { addLayer, layers } = useDataLayers();
  const fileInput = useRef<HTMLInputElement>(null);
  const textInput = useRef<HTMLTextAreaElement>(null);
  const [importedId, setImportedId] = useState<string | null>(null);
  const router = useRouter();

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
              const name = geoJSON.features[0].properties?.name;
              const { id } = addLayer({ name, layer: geoJSON });
              setImportedId(id);
            });
            reader.readAsText(file, "utf8");
          }
        });
      }
    }
  }, [addLayer]);

  const submitGeoJson = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      if (textInput.current) {
        e.preventDefault();
        const geoJson: GeoJSON.FeatureCollection = JSON.parse(
          textInput.current.value
        );
        const name = geoJson.features[0].properties?.name;
        const { id } = addLayer({ name, layer: geoJson });
        setImportedId(id);
      }
    },
    [addLayer]
  );

  useEffect(() => {
    if (importedId) {
      router.push(`/property-crossings/${importedId}`);
    }
  }, [importedId, router, layers]);

  useEffect(() => {
    const input = fileInput.current;
    input?.addEventListener("change", onFileChange);
    return () => {
      input?.removeEventListener("change", onFileChange);
    };
  }, [onFileChange]);

  return (
    <Card title="Import Path">
      <div className="divider">Upload file</div>
      <input
        type="file"
        className="file-input file-input-bordered file-input-primary w-full"
        ref={fileInput}
      />
      <div className="divider">or paste geoJSON</div>
      <form className="flex flex-col gap-4" onSubmit={submitGeoJson}>
        <textarea
          className="textarea textarea-primary"
          placeholder="GeoJSON..."
          ref={textInput}
        />
        <button className="btn btn-primary">Import</button>
      </form>
    </Card>
  );
};
