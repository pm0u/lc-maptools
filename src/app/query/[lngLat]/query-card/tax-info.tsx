import {
  TaxCalculableFeature,
  getFormattedCountyTaxes,
  isCountyProperty,
} from "@/lib/tax";

export const TaxInfo = ({ feature }: { feature: TaxCalculableFeature }) => {
  return (
    <td>
      {isCountyProperty(feature) ? (
        <span>-</span>
      ) : (
        <span>{getFormattedCountyTaxes(feature)}</span>
      )}
    </td>
  );
};
