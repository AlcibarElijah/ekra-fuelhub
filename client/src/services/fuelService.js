/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import rest from "../functions/rest";
import { buildQueryParams } from "./functions/utils";

export const createFuelType = async (fuelType) => {
  try {
    const response = await rest.post("/api/fuels", fuelType);

    return response;
  } catch (error) {
    throw error;
  }
};

export const getFuelTypes = async (params) => {
  try {
    const queryString = buildQueryParams(params);

    const response = await rest.get(
      `/api/fuels${queryString ? `?${queryString}` : ""}`
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getFuelTypeById = async (id) => {
  try {
    const response = await rest.get(`/api/fuels/${id}`);

    return response;
  } catch (error) {
    throw error;
  }
}

export const updateFuelType = async (id, updatedFuelType) => {
  try {
    const response = await rest.put(`/api/fuels/${id}`, updatedFuelType);

    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteFuelType = async (id) => {
  try {
    const response = await rest.delete(`/api/fuels/${id}`);

    return response;
  } catch (error) {
    throw error;
  }
}

const fuelService = {
  createFuelType,
  getFuelTypes,
  getFuelTypeById,
  updateFuelType,
  deleteFuelType
}

export default fuelService;