export function canonicalize(input: string) {
  return input
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing whitespace
    .normalize('NFD') // Normalize to decompose combined characters (e.g., é -> e + ´)
    .replace(' ', '-')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (e.g., accents)
    .replace(/\s+/g, '');
}
