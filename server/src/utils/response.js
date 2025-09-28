export const sendResponse = (res, code, status, message, data = null) => {
  return res.status(code).json({
    status,
    message,
    ...(data ? { data } : {}),
  });
};
