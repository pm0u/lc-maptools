import { getFormattedCountyTaxes } from "@/lib/tax";
import { LCMDParcel } from "@/types/features";

export const TaxInfo = ({ feature }: { feature: LCMDParcel }) => {
  return (
    <div className="py-4 px-2">
      <h5 className="text-xl font-bold mb-2">Tax Value</h5>
      <p>{getFormattedCountyTaxes(feature)}</p>
    </div>
  );
};
