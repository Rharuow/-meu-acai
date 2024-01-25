export const success = ({ data, message }: { message?: string; data?: {} }) => {
  return { message: message || "Success", status: 200, ...(data && { data }) };
};
