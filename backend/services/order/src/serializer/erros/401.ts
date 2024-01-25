export const unauthorized = (message?: string) => {
  return {
    message: message || "Unauthorized: No access token provided",
    status: 401,
  };
};
