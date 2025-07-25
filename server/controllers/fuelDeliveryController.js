/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
/* --------------------------------- models --------------------------------- */
const FuelDelivery = require('../models/FuelDelivery');
const FuelDeliveryVolume = require('../models/FuelDeliveryVolume');
const FuelTank = require('../models/FuelTank');

/* ---------------------------------- utils --------------------------------- */
const {
  handleError,
  validateExistingRecord,
  isValidDate,
} = require('./functions/utils');

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */
const validateInputs = async ({
  dateOrdered,
  deliveryDate,
  paymentDueDate,
  status,
  credit,
  dateDelivered,
  volumes,
}) => {
  if (dateOrdered === null)
    throw { statusCode: 400, message: 'Date ordered cannot be blank.' };
  if (deliveryDate === null)
    throw { statusCode: 400, message: 'Delivery date cannot be blank.' };
  if (paymentDueDate === null)
    throw { statusCode: 400, message: 'Payment due date cannot be blank.' };
  if (status === null)
    throw { statusCode: 400, message: 'Status cannot be blank.' };

  if (!isValidDate(dateOrdered))
    throw { statusCode: 400, message: 'Invalid date ordered.' };
  if (!isValidDate(deliveryDate))
    throw { statusCode: 400, message: 'Invalid delivery date.' };
  if (!isValidDate(paymentDueDate))
    throw { statusCode: 400, message: 'Invalid payment due date.' };
  if (dateDelivered && !isValidDate(dateDelivered))
    throw { statusCode: 400, message: 'Invalid date delivered.' };

  if (credit && typeof credit !== 'number')
    throw { statusCode: 400, message: 'Credit must be a number.' };

  const validStatuses = ['pending', 'approved', 'delivered', 'cancelled'];
  if (validStatuses.includes(status) === false)
    throw { statusCode: 400, message: 'Invalid status.' };

  if ((await validateVolumes(volumes)) === false) {
    throw { statusCode: 400, message: 'Invalid fuel tank volumes.' };
  }
};

/* ----------------------------- validate volume ---------------------------- */
const validateVolume = async (volume) => {
  const fuelTank = volume.fuelTankId;
  const volumeValue = volume.volume;
  const priceValue = volume.price;

  const isVolumeValid =
    typeof volumeValue === 'number' && volumeValue >= 0 && volumeValue !== null;
  const isPriceValid =
    typeof priceValue === 'number' && priceValue >= 0 && priceValue !== null;

  if (!isVolumeValid) throw 'Invalid volume';
  if (!isPriceValid) throw 'Invalid price';

  const { statusCode, message } = await validateExistingRecord(
    FuelTank,
    fuelTank
  );

  if (statusCode !== 200) throw 'Fuel tank validation failed: ' + message;
};

/* ---------------------------- validate volumes ---------------------------- */
const validateVolumes = async (volumes) => {
  try {
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
  } catch (_) {
    return false;
  }
};

/* ---------------------- populate fuel tank in volumes --------------------- */
const populateFuelTankInVolumes = async (volumes) => {
  const populateFuelTankInVolume = async (volume) => {
    const fuelTank = await FuelTank.findById(volume.fuelTank);

    return {
      ...volume.toObject(),
      fuelTank,
    };
  };

  const returnVolumes = await Promise.all(
    volumes.map(populateFuelTankInVolume)
  );
  return returnVolumes;
};

/* ---------------------------- populate delivery --------------------------- */
const populateDelivery = async (delivery) => {
  const deliveryVolumes = await FuelDeliveryVolume.find({
    delivery: delivery._id,
  });

  // get total price
  const totalPrice = getTotalPriceFromVolumes(deliveryVolumes);

  return {
    ...delivery.toObject(),
    volumes: await populateFuelTankInVolumes(deliveryVolumes),
    totalPrice,
  };
};

/* --------------------------- populate deliveries -------------------------- */
const populateDeliveries = async (deliveries) => {
  const populatedDeliveries = await Promise.all(
    deliveries.map(populateDelivery)
  );

  return populatedDeliveries;
};

/* ---------------------- get total price from volumes ---------------------- */
const getTotalPriceFromVolumes = (fuelDeliveryVolumes) => {
  return fuelDeliveryVolumes.reduce((sum, v) => sum + (v.price || 0), 0);
};

/* -------------------------------------------------------------------------- */
/*                                 controllers                                */
/* -------------------------------------------------------------------------- */
/* -------------------------- create fuel delivery -------------------------- */
module.exports.createFuelDelivery = async (req, res) => {
  let newFuelDelivery;
  try {
    const {
      dateOrdered,
      deliveryDate,
      paymentDueDate,
      status,
      credit,
      volumes,
    } = req.body;

    /* ----------------------------- validations ---------------------------- */
    await validateInputs({
      dateOrdered,
      deliveryDate,
      paymentDueDate,
      status,
      credit,
      volumes,
    });

    // create delivery
    newFuelDelivery = await FuelDelivery.create({
      dateOrdered,
      deliveryDate,
      dateDelivered: null,
      status,
      paymentDueDate,
      credit,
    });

    // create volumes
    await Promise.all(
      volumes.map(async (volume) => {
        const { fuelTankId, volume: volumeValue, price } = volume;
        return await FuelDeliveryVolume.create({
          delivery: newFuelDelivery._id,
          fuelTank: fuelTankId,
          volume: volumeValue,
          price,
        });
      })
    );

    res.status(201).json({
      message: 'Fuel delivery created successfully.',
      data: await populateDelivery(newFuelDelivery),
    });
  } catch (error) {
    if (newFuelDelivery) {
      await Promise.all([
        FuelDelivery.findByIdAndDelete(newFuelDelivery._id),
        FuelDeliveryVolume.deleteMany({ delivery: newFuelDelivery._id }),
      ]);
    }

    handleError('Error creating fuel delivery', error, res);
  }
};

/* --------------------------- get fuel deliveries -------------------------- */
module.exports.getFuelDeliveries = async (req, res) => {
  try {
    const { page = 1, pageSize = 25, startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.deliveryDate = {};
      if (startDate) query.deliveryDate.$gte = new Date(startDate);
      if (endDate) query.deliveryDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const [deliveries, count] = await Promise.all([
      FuelDelivery.find(query)
        .sort({ deliveryDate: -1 })
        .skip(skip)
        .limit(limit),
      FuelDelivery.countDocuments(query),
    ]);

    res.status(200).json({
      message: 'Fuel deliveries fetched successfully.',
      data: await populateDeliveries(deliveries),
      count,
    });
  } catch (error) {
    handleError('Error fetching fuel deliveries.', error, res);
  }
};

/* ------------------------ get single fuel delivery ------------------------ */
module.exports.getSingleFuelDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      statusCode,
      message,
      data: delivery,
    } = await validateExistingRecord(FuelDelivery, id);

    if (statusCode !== 200) return res.status(statusCode).json({ message });

    return res.status(200).json({
      message: 'Fuel delivery fetched successfully.',
      data: await populateDelivery(delivery),
    });
  } catch (error) {
    handleError('Error fetching the fuel delivery', error, res);
  }
};

/* -------------------------- update fuel delivery -------------------------- */
module.exports.updateFuelDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      dateOrdered,
      deliveryDate,
      status,
      paymentDueDate,
      dateDelivered,
      volumes,
    } = req.body;

    /* ------------------------------ validate ------------------------------ */
    await validateInputs({
      dateOrdered,
      deliveryDate,
      status,
      paymentDueDate,
      dateDelivered,
      volumes,
    });

    const { statusCode, message } = await validateExistingRecord(
      FuelDelivery,
      id
    );

    if (statusCode !== 200) res.status(statusCode).json({ message });

    // update delivery
    const updatedFuelDelivery = await FuelDelivery.findByIdAndUpdate(
      id,
      {
        dateOrdered,
        deliveryDate,
        dateDelivered,
        status,
        paymentDueDate,
      },
      {
        new: true,
      }
    );

    // delete all the volumes of this delivery
    await FuelDeliveryVolume.deleteMany({ delivery: id });

    // update volumes
    await Promise.all(
      volumes.map(async (volume) => {
        const { fuelTankId: fuelTank, volume: volumeValue, price } = volume;
        await FuelDeliveryVolume.create({
          delivery: id,
          fuelTank,
          volume: volumeValue,
          price,
        });
      })
    );

    return res.status(200).json({
      message: 'Fuel Delivery updated successfully.',
      data: await populateDelivery(updatedFuelDelivery),
    });
  } catch (error) {
    handleError('Error updating the fuel delivery', error, res);
  }
};

/* -------------------------- delete fuel delivery -------------------------- */
module.exports.deleteFuelDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    /* ------------------------------ validate ------------------------------ */
    const { statusCode, message } = await validateExistingRecord(
      FuelDelivery,
      id
    );

    if (statusCode !== 200) return res.status(statusCode).json({ message });

    await Promise.all([
      FuelDelivery.findOneAndDelete(id),
      FuelDeliveryVolume.deleteMany({ delivery: id }),
    ]);

    res.status(200).json({
      message: 'Fuel delivery deleted successfully.',
    });
  } catch (error) {
    handleError('Error deleting the fuel delivery', error, res);
  }
};
