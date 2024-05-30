export const response = (c: any, data: object, code: number = 200) => {
//   c.res.status(code);
  c.json({
    ...data,
    timestamp: `${new Date().toUTCString()}`,
  });
};