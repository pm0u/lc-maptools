import { CiExport } from "react-icons/ci";
import { TotalTaxValue } from "@/app/query/[lngLat]/query-card/total-tax-value";
import { useCopyToClipboard } from "@/hooks/use-clipboard";
import { objectsToCsv } from "@/lib/csv";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { useCallback, useMemo, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { ExportModal } from "@/components/export-modal";

export const BottomRow = ({
  features,
  withTaxes = true,
  exportName,
}: {
  features: MapboxGeoJSONFeature[];
  withTaxes?: boolean;
  exportName?: string;
}) => {
  const [, copy] = useCopyToClipboard();
  const [exporting, setExporting] = useState(false);

  const exportableFeatures = useMemo(() => {
    const exportableFeatures = features.map((feature) => {
      const jsonFeature =
        "toJSON" in feature && typeof feature.toJSON === "function"
          ? feature.toJSON()
          : feature;
      const { geometry, layer, type, sourceLayer, state, source, ...rest } =
        jsonFeature;
      return rest;
    });
    return exportableFeatures;
  }, [features]);

  const onCopy = useCallback(() => {
    const csv = objectsToCsv(exportableFeatures, { withHeadings: false });
    copy(csv);
  }, [copy, exportableFeatures]);

  const onExport = useCallback(() => {
    setExporting(true);
  }, []);

  return (
    <>
      <tr>
        <td className="flex items-center gap-2">
          <button
            className="flex items-center hover:text-secondary"
            onClick={onCopy}
          >
            <MdContentCopy className="h-6 w-auto" />
          </button>
          <button
            className="flex items-center hover:text-secondary"
            onClick={onExport}
          >
            <CiExport className="h-6 w-auto" strokeWidth={1} />
          </button>
        </td>
        {withTaxes ? <TotalTaxValue features={features} /> : null}
      </tr>
      <tr className="hidden">
        <td>
          <ExportModal
            data={exportableFeatures}
            open={exporting}
            onClose={() => {
              setExporting(false);
            }}
            exportName={exportName}
          />
        </td>
      </tr>
    </>
  );
};
