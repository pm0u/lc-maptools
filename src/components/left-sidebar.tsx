import { ToolButton } from "@/components/tool-button";
import { FaFileUpload } from "react-icons/fa";

export const LeftSideBar = () => {
  return (
    <nav className="absolute left-0 inset-y-0">
      <ul className="flex flex-col gap-4 pointer-events-auto">
        <li>
          <ToolButton icon={<FaFileUpload />} href="/file-import" />
        </li>
      </ul>
    </nav>
  );
};
