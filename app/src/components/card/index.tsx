import { Close } from "@/components/card/close";

export const Card = ({
  children,
  title,
  closable = true,
}: {
  children: React.ReactNode;
  title?: string;
  closable?: boolean;
}) => {
  return (
    <dialog className="card absolute left-20 top-0 pb-8 pt-4 px-4 w-1/4 m-0 drop-shadow-hover gap-4 pointer-events-auto">
      {closable ? <Close /> : null}
      {title ? <h2 className="card-title">{title}</h2> : null}
      {children}
    </dialog>
  );
};

/**
 * Position
 * Closeable...
 * anything else?
 */
