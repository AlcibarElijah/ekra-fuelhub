/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState } from 'react';
import { toast } from 'react-toastify';

/* ---------------------------------- hooks --------------------------------- */
import { useUtils } from './useUtils';

/* -------------------------------- services -------------------------------- */
import fuelTankDeliveryService from '../services/fuelTankDeliveryService';

export const useFuelTankDeliveryService = () => {
  const { handleError } = useUtils();

  const [isLoading, setIsLoading] = useState(false);

  const createFuelDelivery = async ({
    dateOrdered,
    deliveryDate,
    paymentDueDate,
    volumes,
    status,
  }) => {
    try {
      setIsLoading(true);

      await fuelTankDeliveryService.createFuelDelivery({
        dateOrdered,
        deliveryDate,
        paymentDueDate,
        volumes,
        status,
      });

      toast.success('Fuel delivery created successfully.');
    } catch (error) {
      handleError('Something went wrong creating the fuel delivery', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getFuelDeliveries = async ({
    startDate,
    endDate,
    page,
    pageSize,
    status,
  }) => {
    try {
      setIsLoading(true);

      const { data: deliveries, count } =
        await fuelTankDeliveryService.getFuelDeliveries({
          startDate,
          endDate,
          page,
          pageSize,
          status,
        });

      return { deliveries, count };
    } catch (error) {
      handleError(
        'Something went wrong retrieving the fuel deliveries.',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getFuelDeliveryById = async (id) => {
    try {
      setIsLoading(true);

      const { data: delivery } =
        await fuelTankDeliveryService.getFuelDeliveryById(id);

      return delivery;
    } catch (error) {
      handleError('Something went wrong retrieving the fuel delivery.', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFuelDeliveryByIdAndUpdate = async (
    id,
    { dateOrdered, deliveryDate, paymentDueDate, status, volumes }
  ) => {
    try {
      setIsLoading(true);

      await fuelTankDeliveryService.getFuelDeliveryByIdAndUpdate(id, {
        dateOrdered,
        deliveryDate,
        paymentDueDate,
        status,
        volumes,
      });

      toast.success('Fuel delivery updated successfully.');
    } catch (error) {
      handleError('Something went wrong updating the fuel delivery.', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFuelDeliveryByIdAndDelete = async (id) => {
    try {
      setIsLoading(true);

      await fuelTankDeliveryService.getFuelDeliveryByIdAndDelete(id);

      toast.success('Fuel delivery deleted successfully.');
    } catch (error) {
      handleError('Something went wrong deleting the fuel delivery.', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createFuelDelivery,
    getFuelDeliveries,
    getFuelDeliveryById,
    getFuelDeliveryByIdAndUpdate,
    getFuelDeliveryByIdAndDelete,
  };
};
