"use client";

import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams<{ lnglat: string }>();
  console.log(params.lnglat);
  return <></>;
};

export default Page;
