/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { toast } from "react-toastify";

/* -------------------------------- services -------------------------------- */
import positionService from "../services/positionService";

/* ---------------------------------- hooks --------------------------------- */
import { useUtils } from "./useUtils";

export const usePositionService = () => {
  const { handleError } = useUtils();
  const [isLoading, setIsLoading] = useState(false);

  const createPosition = async (newPosition) => {
    try {
      setIsLoading(true);
      const { message } = await positionService.createPosition(newPosition);
      toast.success(message);
    } catch (error) {
      handleError("Something went wrong while creating the position.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getPositions = async () => {
    try {
      setIsLoading(true);
      const { data, count } = await positionService.getPositions();
      return { data, count };
    } catch (error) {
      handleError("Something went wrong while getting the positions.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionById = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await positionService.getPositionById(id);
      return data;
    } catch (error) {
      handleError("Something went wrong while getting the position.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePosition = async (id, updatedPosition) => {
    try {
      setIsLoading(true);
      const { message } = await positionService.updatePosition(
        id,
        updatedPosition
      );
      toast.success(message);
    } catch (error) {
      handleError("Something went wrong while updating the position.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePosition = async (id) => {
    try {
      setIsLoading(true);
      const { message } = await positionService.deletePosition(id);
      toast.success(message);
    } catch (error) {
      handleError("Something went wrong while deleting the position.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createPosition,
    getPositions,
    getPositionById,
    updatePosition,
    deletePosition,
  };
};
