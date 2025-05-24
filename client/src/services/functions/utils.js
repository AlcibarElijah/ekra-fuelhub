export const buildQueryParams = (params) => {
  const { filters, sort, ...others } = params;

  const queryParams = {
    ...others,
    ...(filters || {}),
    ...(sort != null ? { sort } : {}),
  };

  const queryString = new URLSearchParams(queryParams).toString();
  return queryString
};
