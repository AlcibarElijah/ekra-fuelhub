/**
 *
 * @param {object} params
 * @param {number} [params.page] - The page number
 * @param {number} [params.pageSize] - The page size
 * @param {{key: value}} [params.filters] - The filter object
 * @param {string} [params.sort] - The column to sort by
 * @param {Enumerator["asc" | "desc"]} [params.sortDirection] - The direction to sort by
 * @returns
 */
export const buildQueryParams = (params) => {
  const { filters = {}, sort = {}, ...others } = params;

  const queryParams = {
    ...others,
    ...(filters || {}),
    ...(sort != null ? { sort } : {}),
  };

  const queryString = new URLSearchParams(queryParams).toString();
  return queryString;
};
