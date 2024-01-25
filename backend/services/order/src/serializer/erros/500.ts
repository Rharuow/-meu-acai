export const internalServerError = (message?: string) => {
  return {
    message: message || "Sorry there was an error on the server.",
    status: 500,
  };
};
