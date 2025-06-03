/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const {
  handleError,
  validateExistingRecord,
  isValidDate,
  isValidNumber,
} = require('./functions/utils');

/* --------------------------------- models --------------------------------- */
const FuelTankReading = require('../models/FuelTankReading');
const FuelTankReadingVolume = require('../models/fuelTankReadingVolume');
const FuelTank = require('../models/FuelTank');

/* -------------------------------------------------------------------------- */
/*                                 definitions                                */
/* -------------------------------------------------------------------------- */
/**
 * The fuel tank reading object submitted by the frontend
 * @typedef {object} fuelTankReading
 * @prop {string} fuelTankReading.fuelTankId The ID of the tank associated
 * @prop {number} fuelTankReading.volume The volume of the fuel tank
 */

/* -------------------------------------------------------------------------- */
/*                                  function                                  */
/* -------------------------------------------------------------------------- */
/**
 * Validate a single fuel tank reading
 * @param {fuelTankReading} fuelTankReading
 */
const validateReading = async (fuelTankReading) => {
  const { fuelTankId, volume } = fuelTankReading;

  if (!isValidNumber(volume))
    throw {
      statusCode: 400,
      message: 'Please input valid numbers.',
    };

  if (volume < 0)
    throw {
      statusCode: 400,
      message: 'Fuel tank reading cannot be negative.',
    };

  const { statusCode, message } = await validateExistingRecord(
    FuelTank,
    fuelTankId
  );

  if (statusCode !== 200)
    throw {
      statusCode,
      message,
    };

  return true;
};

/**
 * Validates if the values received from the frontend are valid
 * @param {Date} date The date of the readings
 * @param {fuelTankReading[]} fuelTankReadings The new readings to be created
 */
const validateFuelTankReadingInputs = async (date, fuelTankReadings) => {
  try {
    /* ------------------------------ validation ------------------------------ */
    // Check if date is valid
    if (!isValidDate(date))
      throw {
        statusCode: 400,
        message: 'Please input a valid date.',
      };

    // check that all inputs are valid
    const validityOfEachReading = await Promise.all(
      fuelTankReadings.map(validateReading)
    );

    const allTrue = validityOfEachReading.every(Boolean);

    if (!allTrue)
      throw {
        statusCode: 500,
        message: 'Something went wrong while validating the inputs.',
      };

    return {
      statusCode: 200,
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      message: error.message,
    };
  }
};

/**
 * Create the fuel tank reading
 * @param {Date} date The date of the reading
 * @param {fuelTankReading[]} fuelTankReadings The fuel tank readings
 * @returns
 */
const createFuelTankReadingVolumes = async (date, fuelTankReadings) => {
  let newFuelTankReadingVolumes;
  try {
    const fuelTankReading = await FuelTankReading.create({ date });

    newFuelTankReadingVolumes = await Promise.all(
      fuelTankReadings.map((reading) =>
        FuelTankReadingVolume.create({
          reading: fuelTankReading._id,
          fuelTank: reading.fuelTankId,
          volume: reading.volume,
        })
      )
    );

    return {
      ...fuelTankReading,
      readings: [...newFuelTankReadingVolumes],
    };
  } catch (error) {
    await Promise.all(
      newFuelTankReadingVolumes.map((reading) =>
        FuelTankReadingVolume.findByIdAndDelete(reading._id)
      )
    );

    throw error;
  }
};

const updateFuelTankReadingVolumes = async (id, date, fuelTankReadings) => {
  let originalFuelTankReadingVolumes, newFuelTankReadingVolumes;
  try {
    const fuelTankReading = await FuelTankReading.findById(id);

    if (!fuelTankReading) {
      throw {
        statusCode: 404,
        message: 'Fuel tank reading not found.',
      };
    }

    const updatedFuelTankReading = await FuelTankReading.findByIdAndUpdate(
      id,
      {
        date,
      },
      { new: true }
    );

    // Get original volumes before updating
    originalFuelTankReadingVolumes = await Promise.all(
      fuelTankReadings.map((reading) =>
        FuelTankReadingVolume.findById(reading._id)
      )
    );

    console.log(fuelTankReadings);

    // Update all volumes in parallel
    newFuelTankReadingVolumes = await Promise.all(
      fuelTankReadings.map(
        async (reading) =>
          await FuelTankReadingVolume.findOneAndUpdate(
            { fuelTank: reading.fuelTankId, reading: id },
            {
              fuelTank: reading.fuelTankId,
              volume: reading.volume,
            },
            { new: true }
          )
      )
    );

    console.log('newFuelTankReadingVolumes', newFuelTankReadingVolumes);

    return {
      ...updatedFuelTankReading.toObject(),
      readings: [...newFuelTankReadingVolumes],
    };
  } catch (error) {
    // Revert back to original values if any update failed
    if (originalFuelTankReadingVolumes) {
      await Promise.all(
        originalFuelTankReadingVolumes.map((originalReading) =>
          FuelTankReadingVolume.findByIdAndUpdate(originalReading._id, {
            fuelTank: originalReading.fuelTank,
            volume: originalReading.volume,
          })
        )
      );
    }

    throw error;
  }
};

/**
 * Populates the fuel tank reading
 * @param {object} fuelTankReading
 * @returns
 */
const getPopulatedFuelTankReading = async (fuelTankReading) => {
  const volumes = await FuelTankReadingVolume.find({
    reading: fuelTankReading._id,
  });

  return {
    _id: fuelTankReading._id,
    date: fuelTankReading.date,
    volumes,
  };
};

const getPopulatedFuelTankReadings = async (fuelTankReadings) => {
  const populatedFuelTankReadings = await Promise.all(
    fuelTankReadings.map(
      async (reading) => await getPopulatedFuelTankReading(reading)
    )
  );

  return populatedFuelTankReadings;
};

/* -------------------------------------------------------------------------- */
/*                                 controllers                                */
/* -------------------------------------------------------------------------- */
module.exports.createFuelTankReadings = async (req, res) => {
  try {
    const { date, fuelTankReadings } = req.body;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message } = await validateFuelTankReadingInputs(
      date,
      fuelTankReadings
    );

    if (statusCode !== 200) return res.status(statusCode).json({ message });

    const response = await createFuelTankReadingVolumes(date, fuelTankReadings);

    res.status(201).json(response);
  } catch (error) {
    handleError(
      'Something went wrong while trying to create the fuel tank reading',
      error,
      res
    );
  }
};

module.exports.getFuelTankReadings = async (req, res) => {
  try {
    const { page = 1, pageSize = 25, startDate, endDate } = req.query;

    const query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const [readings, count] = await Promise.all([
      FuelTankReading.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      FuelTankReading.countDocuments(query),
    ]);

    res.status(200).json({
      message: 'Fuel tank readings retrieved successfully.',
      data: await getPopulatedFuelTankReadings(readings),
      count,
    });
  } catch (error) {
    handleError(
      'Something went wrong while getting the fuel tank readings',
      error,
      res
    );
  }
};

module.exports.getFuelTankReading = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      statusCode,
      message,
      data: fuelTankReading,
    } = await validateExistingRecord(FuelTankReading, id);

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message,
      });

    return res.status(200).json({
      message: 'Fuel tank reading retrieved successfully.',
      data: await getPopulatedFuelTankReading(fuelTankReading),
    });
  } catch (error) {
    handleError(
      'Something went wrong while getting the fuel tank reading.',
      error,
      res
    );
  }
};

module.exports.updateFuelTankReading = async (req, res) => {
  try {
    const { id } = req.params;

    const { date, fuelTankReadings } = req.body;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message } = await validateExistingRecord(
      FuelTankReading,
      id
    );
    if (statusCode !== 200) return res.status(statusCode).json({ message });

    const { statusCode: inputStatusCode, message: inputMessage } =
      await validateFuelTankReadingInputs(date, fuelTankReadings);
    if (inputStatusCode !== 200)
      return res.status(inputStatusCode).json({ message: inputMessage });

    const response = await updateFuelTankReadingVolumes(
      id,
      date,
      fuelTankReadings
    );

    res.status(200).json({
      message: 'Fuel tank reading updated successfully.',
      data: response,
    });
  } catch (error) {
    handleError(
      'Something went wrong while updating the fuel tank reading.',
      error,
      res
    );
  }
};

/**
 * Deletes a FuelTankReading and its associated FuelTankReadingVolume records by FuelTankReading ID.
 * If any deletion fails, attempts to restore the deleted records.
 */
module.exports.deleteFuelTankReading = async (req, res) => {
  let originalFuelTankReading = null;
  let originalVolumes = null;
  try {
    const { id } = req.params;

    // Validate existence of FuelTankReading
    const fuelTankReading = await FuelTankReading.findById(id);
    if (!fuelTankReading) {
      return res.status(404).json({ message: 'Fuel tank reading not found.' });
    }

    // Find all associated FuelTankReadingVolume records
    const volumes = await FuelTankReadingVolume.find({ reading: id });

    // Store original data for rollback
    originalFuelTankReading = fuelTankReading.toObject();
    originalVolumes = volumes.map((v) => v.toObject());

    // Attempt to delete FuelTankReadingVolume records
    await FuelTankReadingVolume.deleteMany({ reading: id });
    // Attempt to delete FuelTankReading
    await FuelTankReading.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Fuel tank reading and associated volumes deleted successfully.',
    });
  } catch (error) {
    // Rollback logic: try to restore deleted records if deletion failed
    try {
      if (originalFuelTankReading) {
        // Restore FuelTankReading
        await FuelTankReading.create({
          _id: originalFuelTankReading._id,
          date: originalFuelTankReading.date,
          __v: originalFuelTankReading.__v,
        });
      }
      if (originalVolumes && originalVolumes.length > 0) {
        // Restore FuelTankReadingVolume records
        await FuelTankReadingVolume.insertMany(
          originalVolumes.map((v) => ({
            _id: v._id,
            reading: v.reading,
            fuelTank: v.fuelTank,
            volume: v.volume,
            __v: v.__v,
          }))
        );
      }
    } catch (rollbackError) {
      // If rollback fails, log error but do not throw
      console.error('Rollback failed:', rollbackError);
    }
    handleError(
      'Something went wrong while deleting the fuel tank reading.',
      error,
      res
    );
  }
};
