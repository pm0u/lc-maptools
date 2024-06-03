import { BottomRow } from "@/app/query/[lngLat]/query-card/bottom-row";
import { Loader } from "@/app/query/[lngLat]/query-card/loader";
import { TaxInfo } from "@/app/query/[lngLat]/query-card/tax-info";
import { TotalTaxValue } from "@/app/query/[lngLat]/query-card/total-tax-value";
import { useMapboxMapContext } from "@/components/mapbox/mapbox-map-context";
import { getFeatureName } from "@/lib/data";
import { isLCMDParcel } from "@/types/features";
import { MapboxLineFeature } from "@/types/mapbox";
import { FillLayer, MapboxGeoJSONFeature } from "mapbox-gl";
import { useEffect, useState } from "react";
import slugify from "slugify";

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
    zoomAndQueryFeature,
    map,
  } = useMapboxMapContext();

  useEffect(() => {
    if (map) {
      zoomToFeature(feature);
      map.once("moveend", () => {
        const _properties = propertiesAlongLine(feature);
        setProperties(_properties);
      });
    }
  }, [propertiesAlongLine, feature, zoomToFeature, map]);

  return (
    <div className="overflow-x-auto">
      {properties ? (
        properties.length ? (
          <>
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
                      className="hover:bg-base-200 cursor-pointer"
                      onClick={() => {
                        zoomAndQueryFeature(property);
                      }}
                    >
                      <td>
                        <div
                          // @ts-expect-error CSS vars are OK
                          style={{ "--bg-color": bg, "--border-color": border }}
                          className="bg-[var(--bg-color)] border-[var(--border-color)] w-8 h-8 border"
                        />
                      </td>
                      <td colSpan={!isLCMDParcel(property) ? 2 : 1}>
                        {property.properties?.NAME?.trim() ||
                          property.properties?.adm_manage?.trim() ||
                          "UNKNOWN"}
                      </td>
                      {isLCMDParcel(property) ? (
                        <TaxInfo feature={property} />
                      ) : null}
                    </tr>
                  );
                })}
                <BottomRow
                  features={properties}
                  exportName={`${slugify(
                    getFeatureName(feature).toLowerCase(),
                    { replacement: "_" }
                  )}_crossings`}
                />
              </tbody>
            </table>
          </>
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
