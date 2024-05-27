import { Close } from "@/components/card/close";
import { cva } from "class-variance-authority";

const card = cva(
  [
    "card absolute top-0 pb-8 pt-4 px-4 w-1/4 m-0 drop-shadow-hover gap-4 pointer-events-auto",
  ],
  {
    variants: {
      position: {
        left: ["left-20 "],
        right: ["right-8 left-auto"],
      },
    },
  }
);

export const Card = ({
  children,
  title,
  closable = true,
  position = "left",
}: {
  children: React.ReactNode;
  title?: string;
  closable?: boolean;
  position?: "left" | "right";
}) => {
  return (
    <dialog className={card({ position })}>
      {closable ? <Close /> : null}
      {title ? <h2 className="card-title">{title}</h2> : null}
      {children}
    </dialog>
  );
};
