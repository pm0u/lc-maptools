"use client";
import { useHash } from "@/hooks/use-hash";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const pathname = usePathname();
  const hash = useHash();
  return (
    <div className="absolute top-2 z-10 w-full px-2">
      <nav className="navbar bg-base-100 rounded-md px-4 py-1 leading-none">
        <Link
          className={`${
            pathname === "/"
              ? "underline underline-offset-2"
              : "underline-offset-0"
          } transition-all duration-200`}
          href={`/${hash}`}
        >
          <h1 className="text-xl font-bold">Map Tools</h1>
        </Link>
        <div className="flex items-center pl-6 min-h-full">
          <Link
            className={`${
              pathname === "/tax-cost"
                ? "underline underline-offset-2"
                : "underline-offset-0"
            } transition-all duration-200`}
            href={`/tax-cost${hash}`}
          >
            Trail Tax Calculator
          </Link>
        </div>
      </nav>
    </div>
  );
};
