/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import rest from "../functions/rest";

/* ---------------------------- create fuel tank ---------------------------- */
/**
 * Call the create fuel tank API
 *
 * @param {object} newFuelTank - The new fuel tank to be created
 * @param {string} newFuelTank.fuelTypeId - The ID of the fuel type of the tank
 * @param {number} newFuelTank.capacity - The capacity of the tank
 * @param {number} newFuelTank.deadstock - The deadstock of the tank
 * @param {number} newFuelTank.acceptableVariance - The acceptable variance of the tank
 * @returns {{ message: string, data: object }} message and new fuel tank
 */
export const createFuelTank = async (newFuelTank) => {
  try {
    const response = await rest.post("/api/fuel-tanks", newFuelTank);

    return response;
  } catch (error) {
    throw error;
  }
};

/* ----------------------------- get fuel tanks ----------------------------- */
/**
 * Gets all the fuel tanks
 *
 * @returns {{ message: string, data: object[], count }} message and fuel tanks
 */
export const getFuelTanks = async () => {
  try {
    const response = await rest.get("/api/fuel-tanks");

    return response;
  } catch (error) {
    throw error;
  }
};

/* --------------------------- get fuel tank by id -------------------------- */
/**
 * Get a specific fuel tank from id
 *
 * @param {string|objectId} id
 * @returns {{ message: string, data: object }} message and fuel tank
 */
export const getFuelTankById = async (id) => {
  try {
    const response = await rest.get(`/api/fuel-tanks/${id}`);

    return response;
  } catch (error) {
    throw error;
  }
};

/* ---------------------------- update fuel tank ---------------------------- */
/**
 * Update a fuel tank by id
 *
 * @param {string|objectId} id - id of the fuel tank to be updated
 * @param {object} updatedFuelTank - The new fuel tank to be created
 * @param {string} updatedFuelTank.fuelTypeId - The ID of the fuel type of the tank
 * @param {number} updatedFuelTank.capacity - The capacity of the tank
 * @param {number} updatedFuelTank.deadstock - The deadstock of the tank
 * @param {number} updatedFuelTank.acceptableVariance - The acceptable variance of the tank
 * @returns {{ message: string, data: object }} server response
 */
export const updateFuelTank = async (id, updatedFuelTank) => {
  try {
    const response = await rest.put(`/api/fuel-tanks/${id}`, updatedFuelTank);

    return response;
  } catch (error) {
    throw error;
  }
};

/* --------------------------- delete a fuel tank --------------------------- */
/**
 * Delete a specific fuel tank by its id
 *
 * @param {string|objectId} id
 * @returns {{ message: string, data: object }} message and fuel tank
 */
export const deleteFuelTank = async (id) => {
  try {
    const response = await rest.delete(`/api/fuel-tanks/${id}`);

    return response;
  } catch (error) {
    throw error;
  }
};

const fuelTankService = {
  createFuelTank,
  getFuelTanks,
  getFuelTankById,
  updateFuelTank,
};

export default fuelTankService;
