const getKeys = (obj: object, prefix = ""): string[] => {
  if (typeof obj === "undefined" || obj === null) return [];
  return [
    ...Object.entries(obj)
      .filter(([, v]) => (typeof v === "object" ? false : true))
      .map(([key]) => `${prefix}${key}`),
    ...Object.entries(obj).reduce((acc, [key, value]) => {
      if (typeof value === "object")
        return [...acc, ...getKeys(value, `${prefix}${key}.`)];
      return acc;
    }, [] as string[]),
  ];
};
const flatObject = (
  obj: object,
  prefix = ""
): Record<string, string | number | boolean> => {
  if (typeof obj === "undefined" || obj === null) return {};
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === "object")
      return { ...acc, ...flatObject(value, `${prefix}${key}.`) };
    return { ...acc, [`${prefix}${key}`]: value };
  }, {} as Record<string, string | number | boolean>);
};

const escapeCsvValue = (cell: string) => {
  if (cell.replace(/ /g, "").match(/[\s,"]/)) {
    return '"' + cell.replace(/"/g, '""') + '"';
  }
  return cell;
};

export const objectsToCsv = (
  arrayOfObjects: object[],
  { withHeadings = true }: { withHeadings?: boolean } = { withHeadings: true }
) => {
  // collect all available keys
  const keys = new Set<string>(
    arrayOfObjects.map((obj) => getKeys(obj)).flat()
  );
  // for each object create all keys
  const values = arrayOfObjects.map((item) => {
    const fo = flatObject(item);
    const val = Array.from(keys).map((key: string) =>
      key in fo ? escapeCsvValue(`${fo[key]}`) : ""
    );
    return val.join(",");
  });
  if (withHeadings) {
    return `${Array.from(keys).join(",")}\n${values.join("\n")}`;
  }
  return values.join("\n");
};
