/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { toast } from "react-toastify";

/* -------------------------------- services -------------------------------- */
import fuelTankService from "../services/fuelTankService";

/* ---------------------------------- hooks --------------------------------- */
import { useUtils } from "./useUtils";

export const useFuelTankService = () => {
  const { handleError } = useUtils();

  const [isLoading, setIsLoading] = useState(false);

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
  const createFuelTank = async (newFuelTank) => {
    try {
      setIsLoading(true);

      const { message } = await fuelTankService.createFuelTank(newFuelTank);

      toast.success(message);
    } catch (error) {
      handleError("Something went wrong while creating the fuel tank.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gets all the fuel tanks
   *
   * @returns {{ message: string, data: object[], count }} message and fuel tanks
   */
  const getFuelTanks = async () => {
    try {
      setIsLoading(true);

      const { data, count } = await fuelTankService.getFuelTanks();

      return { data, count };
    } catch (error) {
      handleError("Something went wrong while getting the fuel tanks.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get a specific fuel tank from id
   *
   * @param {string|objectId} id
   * @returns {{ message: string, data: object }} message and fuel tank
   */
  const getFuelTankById = async (id) => {
    try {
      setIsLoading(true);

      const { data } = await fuelTankService.getFuelTankById(id);

      return data;
    } catch (error) {
      handleError("Something went wrong while getting the fuel tank.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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
  const updateFuelTank = async (id, updatedFuelTank) => {
    try {
      setIsLoading(true);

      const { message } = await fuelTankService.updateFuelTank(
        id,
        updatedFuelTank
      );

      toast.success(message);
    } catch (error) {
      handleError("Something went wrong while updating the fuel tank.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a specific fuel tank by its id
   *
   * @param {string|objectId} id
   * @returns {{ message: string, data: object }} message and fuel tank
   */
  const deleteFuelTank = async (id) => {
    try {
      setIsLoading(true);

      const { message } = await fuelTankService.deleteFuelTank(id);

      toast.success(message);
    } catch (error) {
      handleError("Something went wrong while deleting the fuel tank.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createFuelTank,
    getFuelTanks,
    getFuelTankById,
    updateFuelTank,
    deleteFuelTank,
  };
};
