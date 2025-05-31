/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import rest from "../functions/rest";
import { isValidDate } from "../functions/utils";
import { buildQueryParams } from "./functions/utils";

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */
/**
 * Check whether the inputs for creating a fuel tank reading are valid
 * @param {object} fuelTankParams - The new fuel tank reading to be created
 * @param {string} fuelTankParams.fuelTankId - The ID of the fuel tank
 * @param {number} fuelTankParams.volume - The volume of the fuel tank reading
 * @param {date} fuelTankParams.date - The date of the fuel tank reading
 */
const validateFuelTankReadingInputs = (fuelTankParams) => {
  try {
    const { fuelTankId, volume, date } = fuelTankParams;

    if (!fuelTankId || !volume === "" || isNaN(Number(volume)) || !date)
      throw new Error("Please fill in all required fields.");

    if (volume < 0)
      throw new Error("Volume must be greater than or equal to 0.");

    if (!isValidDate(date)) throw new Error("Date must be a valid date.");
  } catch (error) {
    throw error;
  }
};

/**
 * Create Fuel Tank Reading
 * @param {object} newFuelTankReading - The new fuel tank reading to be created
 * @param {string} newFuelTankReading.fuelTankId - The ID of the fuel tank
 * @param {number} newFuelTankReading.volume - The volume of the fuel tank reading
 * @param {date} newFuelTankReading.date - The date of the fuel tank reading
 * @returns {{ message: string, data: object }} message and new fuel tank reading
 */
export const createFuelTankReading = async (newFuelTankReading) => {
  try {
    validateFuelTankReadingInputs(newFuelTankReading);

    const response = await rest.post(
      "/api/fuel-tank-readings",
      newFuelTankReading
    );

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Batch create fuel tank readings
 * @param {date} date - The date of the fuel tank readings
 * @param {object[]} fuelTankReadings - The fuel tank readings to be created
 * @param {string|objectId} fuelTankReadings.fuelTankId - The ID of the fuel tank
 * @param {number} fuelTankReadings.volume - The volume of the fuel tank reading
 */
export const batchCreateFuelTankReadings = async (date, fuelTankReadings) => {
  try {
    /* ----------------------------- validation ----------------------------- */
    fuelTankReadings.map((reading) => {
      const { fuelTankId, volume } = reading;
      return validateFuelTankReadingInputs({
        fuelTankId,
        volume,
        date,
      });
    });

    const response = await rest.post("/api/fuel-tank-readings/batch", {
      date,
      fuelTankReadings,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all fuel tank readings
 * @param {object} params - The parameters to be used for filtering
 * @param {string} [params.fuelTankId] - filter by fuel tank id
 * @param {string} [params.startDate] - filter by start date (ISO format)
 * @param {string} [params.endDate] - filter by end date (ISO format)
 * @param {number} [params.page] - current page number
 * @param {number} [params.pageSize] - number of items per page
 * @returns {{ message: string, data: object[], count: number }}
 */
export const getAllFuelTankReadings = async (params) => {
  try {
    const { startDate = "", endDate = "" } = params;

    if (startDate && !isValidDate(startDate)) {
      throw new Error("Start date must be a valid date.");
    }

    if (endDate && !isValidDate(endDate)) {
      throw new Error("End date must be a valid date.");
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        throw new Error("Start date must be before end date.");
      }
    }

    const response = await rest.get(
      `/api/fuel-tank-readings?${buildQueryParams(params)}`
    );

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific fuel tank reading by id
 * @param {string|objectId} id - The id of the fuel tank reading to be retrieved
 * @returns {{ message: string, data: object }}
 */
export const getFuelTankReadingById = async (id) => {
  try {
    const response = await rest.get(`/api/fuel-tank-readings/${id}`);

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a specific fuel tank reading
 * @param {string|objectId} id - The id of the fuel tank reading to be updated
 * @param {object} updatedFuelTankReading - The updated fuel tank reading
 * @param {string} updatedFuelTankReading.fuelTankId - The ID of the fuel tank
 * @param {number} updatedFuelTankReading.volume - The volume of the fuel tank reading
 * @param {date} updatedFuelTankReading.date - The date of the fuel tank reading
 * @param {{ message: string, data: object }}
 */
export const updateFuelTankReading = async (id, updatedFuelTankReading) => {
  try {
    validateFuelTankReadingInputs(updateFuelTankReading);

    const response = await rest.put(
      `/api/fuel-tank-readings/${id}`,
      updatedFuelTankReading
    );

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a fuel tank reading
 * @param {string|objectId} id - The id of the fuel tank reading to be deleted
 * @returns {{ message: string, data: object }}
 */
export const deleteFuelTankReading = async (id) => {
  try {
    const response = await rest.delete(`/api/fuel-tank-readings/${id}`);

    return response;
  } catch (error) {
    throw error;
  }
};

const fuelTankReadingService = {
  createFuelTankReading,
  batchCreateFuelTankReadings,
  getAllFuelTankReadings,
  getFuelTankReadingById,
  updateFuelTankReading,
  deleteFuelTankReading,
};

export default fuelTankReadingService;
