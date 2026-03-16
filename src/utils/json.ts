export function safeParseJson<T>(json: string): T | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
