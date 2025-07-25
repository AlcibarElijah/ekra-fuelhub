/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import rest from '../functions/rest';
import { isValidDate } from '../functions/utils';
import { buildQueryParams } from './functions/utils';

/* -------------------------------------------------------------------------- */
/*                                  variables                                 */
/* -------------------------------------------------------------------------- */
const url = '/api/fuel-delivery';

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */
const validateVolume = async (volume) => {
  const fuelTank = volume.fuelTankId;
  const volumeValue = volume.volume;
  const priceValue = volume.price;

  if (fuelTank === null) throw new Error('Fuel tank cannot be blank.');

  const isVolumeValid =
    typeof volumeValue === 'number' && volumeValue >= 0 && volumeValue !== null;
  const isPriceValid =
    typeof priceValue === 'number' && priceValue >= 0 && priceValue !== null;

  if (!isVolumeValid) throw new Error('Invalid liters');
  if (!isPriceValid) throw new Error('Invalid price');
};

const validateVolumes = async (volumes) => {
  if (!Array.isArray(volumes) || volumes.length === 0)
    throw new Error('You need to add a fuel tank.');

  // Ensure all fuelTankIds are unique
  const ids = volumes.map((v) => v.fuelTankId);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    throw new Error('Each fuel tank can only be added once.');
  }

  await Promise.all(volumes.map(validateVolume));

  return true;
};

const validateInputs = async ({
  dateOrdered,
  deliveryDate,
  paymentDueDate,
  status,
  dateDelivered = null,
  volumes,
}) => {
  if (dateOrdered === null) throw new Error('Date ordered cannot be blank.');
  if (deliveryDate === null) throw new Error('Delivery date cannot be blank.');
  if (paymentDueDate === null)
    throw new Error('Payment due date cannot be blank.');

  if (!isValidDate(dateOrdered)) throw new Error('Invalid date ordered.');
  if (!isValidDate(deliveryDate)) throw new Error('Invalid delivery date.');
  if (!isValidDate(paymentDueDate))
    throw new Error('Invalid payment due date.');
  if (dateDelivered && !isValidDate(dateDelivered))
    throw new Error('Invalid date delivered.');

  if (
    dateOrdered > deliveryDate ||
    dateOrdered > paymentDueDate ||
    (dateDelivered && dateOrdered > dateDelivered)
  )
    throw new Error('Invalid date order.');

  const validStatuses = ['pending', 'approved', 'delivered', 'cancelled'];
  if (status && !validStatuses.includes(status))
    throw new Error('Invalid status');

  await validateVolumes(volumes);

  return true;
};

/* -------------------------------------------------------------------------- */
/*                                  services                                  */
/* -------------------------------------------------------------------------- */
/* -------------------------- create fuel delivery -------------------------- */
const createFuelDelivery = async ({
  dateOrdered,
  deliveryDate,
  paymentDueDate,
  volumes,
  status,
}) => {
  try {
    await validateInputs({
      dateOrdered,
      deliveryDate,
      paymentDueDate,
      volumes,
      status,
    });

    const response = await rest.post(url, {
      dateOrdered,
      deliveryDate,
      paymentDueDate,
      volumes,
      status,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

/* --------------------------- get fuel deliveries -------------------------- */
const getFuelDeliveries = async ({
  startDate,
  endDate,
  page = 1,
  pageSize = 30,
  status,
}) => {
  try {
    const params = { page, pageSize };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (status) params.status = status;
    const query =
      Object.keys(params).length > 0 ? `?${buildQueryParams(params)}` : '';
    const response = await rest.get(url + query);
    return response;
  } catch (error) {
    throw error;
  }
};

/* ------------------------- get fuel delivery by id ------------------------ */
const getFuelDeliveryById = async (id) => {
  try {
    const response = await rest.get(`${url}/${id}`);

    return response;
  } catch (error) {
    throw error;
  }
};

/* ------------------- get fuel delivery by id and update ------------------- */
const getFuelDeliveryByIdAndUpdate = async (
  id,
  { dateOrdered, deliveryDate, paymentDueDate, status, dateDelivered, volumes }
) => {
  try {
    await validateInputs({
      dateOrdered,
      deliveryDate,
      paymentDueDate,
      status,
      dateDelivered,
      volumes,
    });

    const response = await rest.put(`${url}/${id}`, {
      dateOrdered,
      deliveryDate,
      status,
      paymentDueDate,
      dateDelivered,
      volumes,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

/* ------------------- get fuel delivery by id and delete ------------------- */
const getFuelDeliveryByIdAndDelete = async (id) => {
  try {
    const response = await rest.delete(`${url}/${id}`);

    return response;
  } catch (error) {
    throw error;
  }
};

const fuelTankDeliveryService = {
  createFuelDelivery,
  getFuelDeliveries,
  getFuelDeliveryById,
  getFuelDeliveryByIdAndUpdate,
  getFuelDeliveryByIdAndDelete,
};

export default fuelTankDeliveryService;
