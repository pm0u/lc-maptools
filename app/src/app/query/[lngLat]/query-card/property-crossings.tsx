import { Loader } from "@/app/query/[lngLat]/query-card/loader";
import { useMapboxMapContext } from "@/components/mapbox/context";
import { MapboxLineFeature } from "@/types/mapbox";
import { FillLayer, MapboxGeoJSONFeature } from "mapbox-gl";
import { useEffect, useState } from "react";

export const PropertyCrossings = ({
  feature,
}: {
  feature: MapboxLineFeature;
}) => {
  const [properties, setProperties] = useState<MapboxGeoJSONFeature[] | null>(
    null
  );
  const {
    propertiesAlongLine,
    highlightFeature,
    clearHighlightedFeatures,
    zoomToFeature,
  } = useMapboxMapContext();

  useEffect(() => {
    zoomToFeature(feature);
    setTimeout(() => {
      const _properties = propertiesAlongLine(feature);
      setProperties(_properties);
    }, 100);
  }, [propertiesAlongLine, feature, zoomToFeature]);

  return (
    <div className="overflow-x-auto">
      {properties ? (
        properties.length ? (
          <table className="table">
            <tbody
              onMouseLeave={() => {
                clearHighlightedFeatures();
              }}
            >
              {properties.map((property) => {
                const layer = property.layer as FillLayer;
                const bg = layer.paint?.["fill-color"]
                  ?.toString()
                  .replace(/1\)$/, "0.6)");
                const border = layer.paint?.["fill-outline-color"]
                  ?.toString()
                  .replace(/1\)$/, "0.6");
                return (
                  <tr
                    key={property.id}
                    onMouseEnter={() => {
                      highlightFeature(property);
                    }}
                    className="hover:bg-base-200"
                  >
                    <td>
                      <div
                        // @ts-expect-error CSS vars are OK
                        style={{ "--bg-color": bg, "--border-color": border }}
                        className="bg-[var(--bg-color)] border-[var(--border-color)] w-8 h-8 border"
                      />
                    </td>
                    <td
                      className={
                        property.properties?.NAME?.trim()
                          ? ""
                          : "text-neutral-content"
                      }
                    >
                      {property.properties?.NAME?.trim() || "UNKNOWN"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-8">
            No private or public property crossings
          </p>
        )
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader />
        </div>
      )}
    </div>
  );
};
