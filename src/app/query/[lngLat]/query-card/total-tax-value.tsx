import {
  TaxCalculableFeature,
  getFormattedCountyTaxesForFeatures,
  isTaxExemptFeature,
  isTaxCalculableFeature,
} from "@/lib/tax";
import { MapboxGeoJSONFeature } from "mapbox-gl";

export const TotalTaxValue = ({
  features,
}: {
  features: MapboxGeoJSONFeature[];
}) => {
  const validFeatures = features.filter(
    (feature) => isTaxCalculableFeature(feature) && !isTaxExemptFeature(feature)
  ) as unknown as TaxCalculableFeature[];

  return (
    <>
      <td>Total</td>
      <td>{getFormattedCountyTaxesForFeatures(validFeatures)}</td>
    </>
  );
};
