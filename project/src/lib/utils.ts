// Backend fields like `cuisine` or `popularDishes` are sometimes returned as a
// real array and sometimes as a JSON-stringified array (depending on how the
// record was stored). This normalizes either shape into a plain string array
// without throwing if the value is missing, malformed, or not JSON at all.
export function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      // Not valid JSON — treat it as a single value or comma-separated list.
      return value.includes(',') ? value.split(',').map((v) => v.trim()).filter(Boolean) : [value];
    }
  }
  return [];
}
