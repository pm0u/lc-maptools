"use client";
import { useRouterWithHash } from "@/hooks/use-router-with-hash";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";

const button = cva(
  [
    "bg-base-100 rounded-md p-4 drop-shadow-hover hover:text-accent block",
    "active:translate-x-1 active:translate-y-1 active:drop-shadow-hoversm transition-all duration-200 ease-in-out",
  ],
  {
    variants: {
      active: {
        true: ["bg-primary text-primary-content hover:text-primary-content"],
      },
    },
  }
);

const iconClasses = cva(["h-6 w-6 aspect-square"]);

export const ToolButton = ({
  icon,
  href,
}: {
  icon: React.ReactElement;
  href: string;
}) => {
  const pathname = usePathname();
  const linkHref = pathname === href ? "/" : href;
  const router = useRouterWithHash();
  const Icon = icon;
  return (
    <Link
      className={button({ active: pathname === href })}
      href={linkHref}
      // Preserve hash
      onClick={(e) => {
        e.preventDefault();
        router.push(linkHref);
      }}
    >
      <Icon.type {...Icon.props} className={iconClasses()} />
    </Link>
  );
};
