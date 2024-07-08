import { CloseButton } from "@/components/card/close-button";
import { useCopyToClipboard } from "@/hooks/use-clipboard";
import { objectsToCsv } from "@/lib/csv";
import { downloadBlob } from "@/lib/download";
import {
  getFormattedCountyTaxes,
  isTaxExemptFeature,
  isTaxCalculableFeature,
  getAssessorURL,
} from "@/lib/tax";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { cloneDeep } from "lodash";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { useCallback, useState } from "react";
import type { MouseEventHandler } from "react";

const COPY_TEXT = {
  completed: "Copied!",
  rest: "Copy to Clipboard",
};

export const ExportModal = ({
  data,
  open,
  onClose,
  exportName = "map_data",
}: {
  data: MapboxGeoJSONFeature[];
  open: boolean;
  onClose: () => void;
  exportName?: string;
}) => {
  const [, copy] = useCopyToClipboard();
  const [includeHeadings, setIncludeHeadings] = useState(true);
  const [includeTaxValues, setIncludeTaxValues] = useState(true);
  const [includeAssessorLink, setIncludeAssessorLink] = useState(true);
  const [excludeCountyProperty, setExcludeCountyProperty] = useState(true);
  const [copyText, setCopyText] = useState(COPY_TEXT.rest);

  const onExport: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
      let features = cloneDeep(data).filter((f) => isTaxCalculableFeature(f));
      if (excludeCountyProperty) {
        features = features.filter((f) => !isTaxExemptFeature(f));
      }
      if (includeTaxValues) {
        features = features.map((item) => {
          if (isTaxCalculableFeature(item)) {
            return {
              ...item,
              taxValue: getFormattedCountyTaxes(item),
            };
          }
          return item;
        });
      }
      if (includeAssessorLink) {
        features = features.map((item) => {
          if (isTaxCalculableFeature(item)) {
            return {
              ...item,
              assessorLink: getAssessorURL(item),
            };
          }
          return item;
        });
      }
      const csv = objectsToCsv(features, { withHeadings: includeHeadings });
      downloadBlob(csv, `${exportName}.csv`);
    },
    [
      data,
      includeHeadings,
      exportName,
      includeTaxValues,
      excludeCountyProperty,
      includeAssessorLink,
    ]
  );

  const onCopy: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
      let features = cloneDeep(data).filter((f) => isTaxCalculableFeature(f));
      if (excludeCountyProperty) {
        features = features.filter((f) => !isTaxExemptFeature(f));
      }
      if (includeTaxValues) {
        features = features.map((item) => {
          if (isTaxCalculableFeature(item)) {
            return {
              ...item,
              taxValue: getFormattedCountyTaxes(item),
            };
          }
          return item;
        });
      }
      if (includeAssessorLink) {
        features = features.map((item) => {
          if (isTaxCalculableFeature(item)) {
            return {
              ...item,
              assessorLink: getAssessorURL(item),
            };
          }
          return item;
        });
      }
      const csv = objectsToCsv(features, { withHeadings: includeHeadings });
      copy(csv);
      setCopyText(COPY_TEXT.completed);
      setTimeout(() => {
        setCopyText(COPY_TEXT.rest);
      }, 800);
    },
    [
      includeHeadings,
      data,
      copy,
      includeTaxValues,
      excludeCountyProperty,
      includeAssessorLink,
    ]
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30 z-10" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-20">
        <DialogPanel className="card pb-8 pt-4 px-4 bg-base-100 drop-shadow-hover pointer-events-auto w-1/4">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-xl font-bold">Export</DialogTitle>
            <CloseButton onClose={onClose} />
          </div>
          <form className="flex flex-col items-start">
            <div className="flex-flex-col justify-start pb-2">
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  className="checkbox"
                  id="withHeadings"
                  name="withHeadings"
                  checked={includeHeadings}
                  onChange={() => setIncludeHeadings((s) => !s)}
                />
                <span className="label-text pl-4">Include Headings</span>
              </label>
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  className="checkbox"
                  id="withTaxValues"
                  name="withTaxValues"
                  checked={includeTaxValues}
                  onChange={() => setIncludeTaxValues((s) => !s)}
                />
                <span className="label-text pl-4">
                  Include Computed Tax Values
                </span>
              </label>
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  className="checkbox"
                  id="withAssessorLink"
                  name="withAssessorLink"
                  checked={includeAssessorLink}
                  onChange={() => setIncludeAssessorLink((s) => !s)}
                />
                <span className="label-text pl-4">
                  Include County Assessor Account Link
                </span>
              </label>
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  className="checkbox"
                  id="excludeCounty"
                  name="excludeCounty"
                  checked={excludeCountyProperty}
                  onChange={() => setExcludeCountyProperty((s) => !s)}
                />
                <span className="label-text pl-4">
                  Exclude County Property (County does not collect tax revenue)
                </span>
              </label>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={onExport}>
                <span className="text-primary-content">Export</span>
              </button>
              <button className="btn btn-secondary" onClick={onCopy}>
                <span className="text-primary-content">{copyText}</span>
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
