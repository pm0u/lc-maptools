import { FileImportCardContents } from "@/app/file-import/card/card-contents";
import { Loader } from "@/components/loader";
import { Card } from "@/components/card";
import { Suspense } from "react";

export const FileImportCard = () => {
  return (
    <Card>
      <Suspense fallback={<Loader />}>
        <FileImportCardContents />
      </Suspense>
    </Card>
  );
};
