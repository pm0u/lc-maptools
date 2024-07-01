import { FaGithub } from "react-icons/fa";
export const AppFooter = () => {
  return (
    <div className="bg-base-100 bg-opacity-50 flex gap-2 py-0.5 px-1 absolute bottom-0 left-1/2 -translate-x-1/2 items-center text-xs">
      <span>created by paul mourer</span>
      <span>|</span>
      <span>open source</span>
      <span>|</span>
      <a
        href="https://github.com/pm0u/lc-maptools"
        className="flex items-center gap-1 underline underline-offset-2 hover:underline-offset-1 transition-all duration-300 ease-in-out"
      >
        view and contribute on github <FaGithub />
      </a>
    </div>
  );
};
