import {
  TaxCalculableFeature,
  getFormattedCountyTaxes,
  isTaxExemptFeature,
} from "@/lib/tax";

export const TaxInfo = ({ feature }: { feature: TaxCalculableFeature }) => {
  return (
    <td>
      {isTaxExemptFeature(feature) ? (
        <span>-</span>
      ) : (
        <span>{getFormattedCountyTaxes(feature)}</span>
      )}
    </td>
  );
};
