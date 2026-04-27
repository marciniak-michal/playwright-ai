export function generateUniqueEmail(prefix = 'testuser'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${random}@example.com`;
}
