import { getAssessorURL, getFormattedCountyTaxes } from "@/lib/tax";
import { LCMDParcel } from "@/types/features";
import { FaExternalLinkAlt } from "react-icons/fa";

export const TaxValue = ({ feature }: { feature: LCMDParcel }) => {
  const taxValue = getFormattedCountyTaxes(feature);

  return (
    <div className="p-4 gap-4 flex flex-col">
      <span>Est. County Tax Value: {taxValue}</span>
      <a
        target="_blank"
        href={getAssessorURL(feature)}
        className="flex gap-2 items-center leading-none underline underline-offset-2 hover:underline-offset-1 transition-all duration-300 ease-in-out"
      >
        Link to assessor website <FaExternalLinkAlt />
      </a>
    </div>
  );
};
