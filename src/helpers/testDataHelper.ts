export function generateUniqueEmail(prefix = 'testuser'): string {
  const timestamp = Date.now();
  return `${prefix}${timestamp}@example.com`;
}
