import { BottomRow } from "@/app/query/[lngLat]/query-card/bottom-row";
import { Loader } from "@/components/loader";
import { TaxInfo } from "@/app/query/[lngLat]/query-card/tax-info";
import { useMapboxMapContext } from "@/components/mapbox/mapbox-map-context";
import { getFeatureName } from "@/lib/data";
import { isTaxCalculableFeature } from "@/lib/tax";
import { CrossingsResponse } from "@/types/crossings";
import {
  LakeCountyFeature,
  isLCMDParcel,
  isPublicLandParcel,
} from "@/types/features";
import { MapboxLineFeature } from "@/types/mapbox";
import { useEffect, useState } from "react";
import slugify from "slugify";

const getColors = (
  parcel: LakeCountyFeature,
  colors: CrossingsResponse["colors"]
) => {
  if (isLCMDParcel(parcel)) {
    return colors[
      parcel.properties.name as keyof typeof colors
    ] as CrossingsResponse["colors"][keyof CrossingsResponse["colors"]];
  }
  if (isPublicLandParcel(parcel)) {
    return colors[
      parcel.properties.adm_manage as keyof typeof colors
    ] as CrossingsResponse["colors"][keyof CrossingsResponse["colors"]];
  }

  return { fillColor: "#FFFFFF", fillOutlineColor: "#000000" };
};

export const PropertyCrossings = ({
  feature,
}: {
  feature: MapboxLineFeature;
}) => {
  const [parcels, setParcels] = useState<LakeCountyFeature[] | null>(null);
  const [colors, setColors] = useState<Record<
    string,
    { fillColor: string; fillOutlineColor: string }
  > | null>(null);
  const { highlightFeature, clearHighlightedFeatures, zoomAndQueryFeature } =
    useMapboxMapContext();

  useEffect(() => {
    const getCrossings = async () => {
      if (feature && feature.id) {
        const response = (await fetch(
          `/a/crossings/${feature.sourceLayer}/${feature.id}`
        ).then((res) => res.json())) as CrossingsResponse;
        const { parcels, colors } = response;
        setParcels(parcels);
        setColors(colors);
      }
    };
    getCrossings();
  }, [feature]);

  return (
    <div className="overflow-x-auto">
      {parcels && colors ? (
        parcels.length ? (
          <>
            <table className="table">
              <tbody
                onMouseLeave={() => {
                  clearHighlightedFeatures();
                }}
              >
                {parcels.map((parcel) => {
                  const { fillColor, fillOutlineColor } = getColors(
                    parcel,
                    colors as CrossingsResponse["colors"]
                  );
                  return (
                    <tr
                      key={parcel.id}
                      onMouseEnter={() => {
                        highlightFeature(parcel);
                      }}
                      className="hover:bg-base-200 cursor-pointer"
                      onClick={() => {
                        zoomAndQueryFeature(parcel);
                      }}
                    >
                      <td>
                        <div
                          style={{
                            // @ts-expect-error CSS vars are OK
                            "--bg-color": fillColor,
                            "--border-color": fillOutlineColor,
                          }}
                          className="bg-[var(--bg-color)] border-[var(--border-color)] w-8 h-8 border"
                        />
                      </td>
                      <td colSpan={!isTaxCalculableFeature(parcel) ? 2 : 1}>
                        {getFeatureName(parcel)}
                      </td>
                      {isTaxCalculableFeature(parcel) ? (
                        <TaxInfo feature={parcel} />
                      ) : null}
                    </tr>
                  );
                })}
                <BottomRow
                  features={parcels}
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
