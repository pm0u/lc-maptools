"use client";

import { useSearchParams } from "next/navigation";

const Page = () => {
  const params = useSearchParams();
  console.log(params);
};

export default Page;
