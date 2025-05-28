/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { toast } from "react-toastify";

/* -------------------------------- services -------------------------------- */
import fuelService from "../services/fuelService";

/* ---------------------------------- hooks --------------------------------- */
import { useUtils } from "./useUtils";

export const useFuelService = () => {
  const { handleError } = useUtils();

  const [isLoading, setIsLoading] = useState(false);

  const createFuelType = async (fuel) => {
    try {
      setIsLoading(true);

      const { message } = await fuelService.createFuelType(fuel);

      toast.success(message);
    } catch (error) {
      handleError("Something went wrong creating the fuel type.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getFuelTypes = async (params) => {
    try {
      setIsLoading(true);

      const { data, count } = await fuelService.getFuelTypes(params);

      return {
        data,
        count,
      };
    } catch (error) {
      handleError("Something went wrong getting the fuel types.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createFuelType,
    getFuelTypes
  };
};
