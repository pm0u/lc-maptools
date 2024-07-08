import {
  TaxCalculableFeature,
  getAssessorURL,
  getFormattedCountyTaxes,
  isTaxExemptFeature,
} from "@/lib/tax";
import { FaExternalLinkAlt } from "react-icons/fa";

export const TaxInfo = ({ feature }: { feature: TaxCalculableFeature }) => {
  return (
    <td>
      {isTaxExemptFeature(feature) ? (
        <span>-</span>
      ) : (
        <a
          target="_blank"
          className="flex gap-2 items-center hover:underline"
          href={getAssessorURL(feature)}
          onClick={(e) => e.stopPropagation()}
        >
          {getFormattedCountyTaxes(feature)} <FaExternalLinkAlt />
        </a>
      )}
    </td>
  );
};
