export const errorHandler = (err: any) => {
  /** 500에러 또는 상태코드가 없는 에러 발생시 Sentry에 Logging */
  if (err.status === 500 || !err.status) {
    // TODO: Sentry 활성화 필요
    // Sentry.captureEvent(err);
  }

  throw Object.assign(new Error(), {
    status: err.response.data.statusCode || 500,
    message: err.response.data.message || "",
  });
};
