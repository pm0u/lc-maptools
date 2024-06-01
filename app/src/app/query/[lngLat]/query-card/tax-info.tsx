import { getFormattedCountyTaxes } from "@/lib/tax";
import { LCMDParcel } from "@/types/features";

export const TaxInfo = ({ feature }: { feature: LCMDParcel }) => {
  return (
    <td>
      <span>{getFormattedCountyTaxes(feature)}</span>
    </td>
  );
};
