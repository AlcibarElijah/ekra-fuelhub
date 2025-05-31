/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { toast } from "react-toastify";

/* ---------------------------------- hooks --------------------------------- */
import { useUtils } from "./useUtils";

/* -------------------------------- services -------------------------------- */
import fuelTankReadingService from "../services/fuelTankReadingService";

export const useFuelTankReadingService = () => {
  const { handleError } = useUtils();

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Create Fuel Tank Reading
   * @param {object} newFuelTankReading - The new fuel tank reading to be created
   * @param {string} newFuelTankReading.fuelTankId - The ID of the fuel tank
   * @param {number} newFuelTankReading.volume - The volume of the fuel tank reading
   * @param {date} newFuelTankReading.date - The date of the fuel tank reading
   */
  const createFuelTankReading = async (newFuelTankReading) => {
    try {
      setIsLoading(true);
      const { message } = await fuelTankReadingService.createFuelTankReading(
        newFuelTankReading
      );

      toast.success(message);
    } catch (error) {
      handleError(
        "Something went wrong while creating the fuel tank reading.",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Batch create fuel tank readings
   * @param {date} date - The date of the fuel tank readings
   * @param {object[]} fuelTankReadings - The fuel tank readings to be created
   * @param {string|objectId} fuelTankReadings.fuelTankId - The ID of the fuel tank
   * @param {number} fuelTankReadings.volume - The volume of the fuel tank reading
   */
  const batchCreateFuelTankReadings = async (date, fuelTankReadings) => {
    try {
      setIsLoading(true);
      const { message } =
        await fuelTankReadingService.batchCreateFuelTankReadings(
          date,
          fuelTankReadings
        );

      toast.success(message);
    } catch (error) {
      handleError(
        "Something went wrong while creating the fuel tank readings.",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get all fuel tank readings
   * @param {object} params - The parameters to be used for filtering
   * @param {string} [params.fuelTankId] - filter by fuel tank id
   * @param {string} [params.startDate] - filter by start date
   * @param {string} [params.endDate] - filter by end date
   * @param {number} [params.page] - current page number
   * @param {number} [params.pageSize] - number of items per page
   * @returns {{ data: object[], count }}
   */
  const getAllFuelTankReadings = async (params) => {
    try {
      setIsLoading(true);
      const { data, count } =
        await fuelTankReadingService.getAllFuelTankReadings(params);

      return { data, count };
    } catch (error) {
      handleError(
        "Something went wrong while getting the fuel tank readings.",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get a specific fuel tank reading by id
   * @param {string|objectId} id - The id of the fuel tank reading to be retrieved
   * @returns {{ data: object }}
   */
  const getFuelTankReadingById = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await fuelTankReadingService.getFuelTankReadingById(id);
      return data;
    } catch (error) {
      handleError(
        "Something went wrong while getting the fuel tank reading.",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update a specific fuel tank reading
   * @param {string|objectId} id - The id of the fuel tank reading to be updated
   * @param {object} updatedFuelTankReading - The updated fuel tank reading
   * @param {string} updatedFuelTankReading.fuelTankId - The ID of the fuel tank
   * @param {number} updatedFuelTankReading.volume - The volume of the fuel tank reading
   * @param {date} updatedFuelTankReading.date - The date of the fuel tank reading
   */
  const updateFuelTankReading = async (id, updatedFuelTankReading) => {
    try {
      setIsLoading(true);
      const { message } = await fuelTankReadingService.updateFuelTankReading(
        updatedFuelTankReading
      );

      toast.success(message);
    } catch (error) {
      handleError(
        "Something went wrong while updating the fuel tank reading.",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a fuel tank reading
   * @param {string|objectId} id - The id of the fuel tank reading to be deleted
   */
  const deleteFuelTankReading = async (id) => {
    try {
      setIsLoading(true);
      const { message } = await fuelTankReadingService.deleteFuelTankReading(
        id
      );

      toast.success(message);
    } catch (error) {
      handleError(
        "Something went wrong deleting the fuel tank reading.",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createFuelTankReading,
    batchCreateFuelTankReadings,
    getAllFuelTankReadings,
    getFuelTankReadingById,
    updateFuelTankReading,
    deleteFuelTankReading,
  };
};
