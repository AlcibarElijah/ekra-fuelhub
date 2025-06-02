/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import rest from "../functions/rest";

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */
const validatePositionInput = (position) => {
  try {
    const { name } = position;

    if (!name) throw new Error("Please fill in all required fields.");
  } catch (error) {
    throw error;
  }
};

/* ---------------------------- create position ---------------------------- */
/**
 * Call the create position API
 *
 * @param {object} newPosition - The new position to be created
 * @returns {{ message: string, data: object }} message and new position
 */
export const createPosition = async (newPosition) => {
  try {
    /* ----------------------------- validation ----------------------------- */
    validatePositionInput(newPosition); 

    const response = await rest.post("/api/positions", newPosition);
    return response;
  } catch (error) {
    throw error;
  }
};

/* ----------------------------- get positions ----------------------------- */
/**
 * Gets all the positions
 *
 * @returns {{ message: string, data: object[], count }} message and positions
 */
export const getPositions = async () => {
  try {
    const response = await rest.get("/api/positions");
    return response;
  } catch (error) {
    throw error;
  }
};

/* --------------------------- get position by id -------------------------- */
/**
 * Get a specific position from id
 *
 * @param {string|objectId} id
 * @returns {{ message: string, data: object }} message and position
 */
export const getPositionById = async (id) => {
  try {
    const response = await rest.get(`/api/positions/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/* ---------------------------- update position ---------------------------- */
/**
 * Update a position by id
 *
 * @param {string|objectId} id - id of the position to be updated
 * @param {object} updatedPosition - The updated position
 * @returns {{ message: string, data: object }} server response
 */
export const updatePosition = async (id, updatedPosition) => {
  try {
    /* ----------------------------- validation ----------------------------- */
    validatePositionInput(updatedPosition);

    const response = await rest.put(`/api/positions/${id}`, updatedPosition);
    return response;
  } catch (error) {
    throw error;
  }
};

/* --------------------------- delete position --------------------------- */
/**
 * Delete a specific position by its id
 *
 * @param {string|objectId} id
 * @returns {{ message: string, data: object }} message and position
 */
export const deletePosition = async (id) => {
  try {
    const response = await rest.delete(`/api/positions/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const positionService = {
  createPosition,
  getPositions,
  getPositionById,
  updatePosition,
};

export default positionService;
