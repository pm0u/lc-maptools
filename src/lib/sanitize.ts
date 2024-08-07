import { layerDefs } from "@/lib/spatial";
import { AssertionError } from "assert";

/**
 * Really basic sanitization protections
 * It would be hard to be malicious without semicolons and spaces
 */
export function assertSanitized(value: string): asserts value is string {
  assertNoSemi(value);
  assertNoSpaces(value);
}

function assertNoSemi(value: string): asserts value is string {
  if (value.includes(";")) {
    throw new AssertionError({ message: 'Value contains ";"!', actual: value });
  }
}

function assertNoSpaces(value: string): asserts value is string {
  if (value.includes(" "))
    throw new AssertionError({ message: 'Value contains " "!', actual: value });
}

export function assertIsLayer(
  value: string
): asserts value is keyof typeof layerDefs {
  if (!(value in layerDefs))
    throw new AssertionError({
      message: "Value is not a valid layer!",
      actual: value,
      expected: Object.keys(layerDefs),
    });
}
