export const Card = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <dialog className="card absolute left-20 top-0 py-8 px-4 w-1/4 m-0 drop-shadow-hover gap-4 pointer-events-auto">
      <h2 className="card-title">{title}</h2>
      {children}
    </dialog>
  );
};

/**
 * Position
 * Closeable...
 * anything else?
 */
