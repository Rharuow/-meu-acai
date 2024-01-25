export const badRequest = (message?: string) => {
  return { message: message || "Bad Request", status: 400 };
};
