export const sanitizeUsername = (
  username: string | undefined
): string | null => {
  if (typeof username !== "string") return null;
  return /^[a-zA-Z0-9_]{3,30}$/.test(username) ? username : null;
};

export const sanitizeEmail = (email: string | undefined): string | null => {
  if (typeof email !== "string") return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
};

export const sanitizePassword = (
  password: string | undefined
): string | null => {
  if (typeof password !== "string") return null;
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,100}$/.test(password)
    ? password
    : null;
};
