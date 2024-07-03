import { useRouter } from "next/navigation";
import { useCallback } from "react";

const getHash = () =>
  typeof window !== "undefined" ? window.location.hash : undefined;

export const useRouterWithHash = () => {
  const router = useRouter();

  /**
   * Preserve hash for nice link sharing
   */
  const push = useCallback(
    (...args: Parameters<typeof router.push>) => {
      const [url, options] = args;
      if (!url.includes("#")) {
        router.push(`${url}${getHash()}`, options);
        return;
      }
      router.push(...args);
    },
    [router]
  );

  const replace = useCallback(
    (...args: Parameters<typeof router.replace>) => {
      const [url, options] = args;
      if (!url.includes("#")) {
        router.replace(`${url}${getHash()}`, options);
        return;
      }
      router.replace(...args);
    },
    [router]
  );

  return {
    ...router,
    replace,
    push,
  };
};
