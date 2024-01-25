export const unprocessableEntity = (message?: string) => {
  return {
    message: message || "There's some error processing the response",
    status: 422,
  };
};
