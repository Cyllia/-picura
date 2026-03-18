export function parseOptionalNumber(value: string | null) {
  if (value == null) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? undefined : parsedValue;
}

export function parseRequiredNumber(value: string) {
  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}
