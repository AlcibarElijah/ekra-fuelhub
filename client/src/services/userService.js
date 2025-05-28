/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import rest from "../functions/rest";
import { buildQueryParams } from "./functions/utils";

export const createUser = async (user) => {
  try {
    const response = await rest.post("/api/users", user);

    return response;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (params) => {
  try {
    const queryString = buildQueryParams(params);

    const response = await rest.get(
      `/api/users${queryString ? `?${queryString}` : ""}`
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await rest.get(`/api/users/${id}`);

    return response;
  } catch (error) {
    throw error;
  }
}