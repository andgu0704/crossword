// Georgian Unicode block: U+10D0–U+10FF (Mkhedruli script)
const GEORGIAN_START = 0x10d0;
const GEORGIAN_END = 0x10ff;

export function isGeorgianChar(char: string): boolean {
  const cp = char.codePointAt(0);
  if (cp === undefined) return false;
  return cp >= GEORGIAN_START && cp <= GEORGIAN_END;
}

export function normalizeGeorgianInput(input: string): string {
  for (const char of input) {
    if (isGeorgianChar(char)) return char;
  }
  return "";
}
