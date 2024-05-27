import { Card } from "@/components/card";
import { CardContents } from "@/app/query/[lngLat]/query-card/card-contents";
import { Suspense } from "react";

export const QueryCard = () => {
  return (
    <Card>
      <Suspense>
        <CardContents />
      </Suspense>
    </Card>
  );
};
