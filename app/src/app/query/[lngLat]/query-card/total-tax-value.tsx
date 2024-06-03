import { getFormattedCountyTaxesForFeatures } from "@/lib/tax";
import { isLCMDParcel } from "@/types/features";
import { MapboxGeoJSONFeature } from "mapbox-gl";

export const TotalTaxValue = ({
  features,
}: {
  features: MapboxGeoJSONFeature[];
}) => {
  const validFeatures = features.filter(isLCMDParcel);

  return (
    <>
      <td>Total</td>
      <td>{getFormattedCountyTaxesForFeatures(validFeatures)}</td>
    </>
  );
};
