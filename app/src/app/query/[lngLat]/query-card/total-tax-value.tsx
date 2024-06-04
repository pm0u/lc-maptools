import {
  TaxCalculableFeature,
  getFormattedCountyTaxesForFeatures,
  isCountyProperty,
  isTaxCalculableFeature,
} from "@/lib/tax";
import { MapboxGeoJSONFeature } from "mapbox-gl";

export const TotalTaxValue = ({
  features,
}: {
  features: MapboxGeoJSONFeature[];
}) => {
  const validFeatures = features.filter(
    (feature) => isTaxCalculableFeature(feature) && !isCountyProperty(feature)
  ) as TaxCalculableFeature[];

  return (
    <>
      <td>Total</td>
      <td>{getFormattedCountyTaxesForFeatures(validFeatures)}</td>
    </>
  );
};
