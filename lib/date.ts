export function isDateExpired(date: string) {
  const now = new Date();
  const expiresAt = new Date(date);
  return expiresAt < now;
}
