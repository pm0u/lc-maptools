import { CloseButton } from "@/components/card/close-button";
import { useCopyToClipboard } from "@/hooks/use-clipboard";
import { objectsToCsv } from "@/lib/csv";
import {
  CloseButton as HeadlessCloseButton,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
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
}: {
  data: object[];
  open: boolean;
  onClose: () => void;
}) => {
  const [, copy] = useCopyToClipboard();
  const [includeHeadings, setIncludeHeadings] = useState(true);
  const [copyText, setCopyText] = useState(COPY_TEXT.rest);

  const onExport = useCallback(() => {}, []);

  const onCopy: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
      const csv = objectsToCsv(data, { withHeadings: includeHeadings });
      copy(csv);
      setCopyText(COPY_TEXT.completed);
      setTimeout(() => {
        setCopyText(COPY_TEXT.rest);
      }, 800);
    },
    [includeHeadings, data, copy]
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30 z-10" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-20">
        <DialogPanel className="card pb-8 pt-4 px-4 bg-base-100 drop-shadow-hover pointer-events-auto w-1/4">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-xl font-bold">Export</DialogTitle>
            <HeadlessCloseButton>
              <CloseButton />
            </HeadlessCloseButton>
          </div>
          <form className="flex flex-col items-start">
            <div className="flex-flex-col items-start pb-2">
              <label className="label cursor-pointer">
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
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary">
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
