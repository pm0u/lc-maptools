/** A tagged template literal function which accepts a string and returns it un-modified.
 *
 * The purpose of this function is to sort strings containing Tailwind classes.
 * We can prepend "tw" to template strings that are intended as
 * Tailwind classes and allow the tailwind prettier plugin to sort it.
 *
 * I.e. Creating a variable like so:
 * const twClasses = tw`text-red-100 bg-white-100`;
 * will tell the tailwind prettier plugin to sort the classes.
 */
export const tw = (
  strings: TemplateStringsArray,
  ...values: string[]
): string =>
  /**
   * The purpose of the reduce function is to make sure we can pass in a template string
   * with variables and get the correct result. I.e. `Hello I am ${name}`
   * will return `Hello I am Jörundur` if `name` is `Jörundur`.
   */
  strings.reduce(
    (result, stringPart, i) => result + stringPart + (values[i] || ""),
    ""
  );
