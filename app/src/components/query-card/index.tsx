import { Card } from "@/components/card";
import { CardContents } from "@/components/query-card/card-contents";
import { Suspense } from "react";

export const QueryCard = () => {
  return (
    <Card title="Query...">
      <Suspense>
        <CardContents />
      </Suspense>
    </Card>
  );
};
