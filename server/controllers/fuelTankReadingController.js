/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const {
  handleError,
  validateExistingRecord,
  isValidDate,
} = require("./functions/utils");

/* --------------------------------- models --------------------------------- */
const FuelTankReading = require("../models/FuelTankReading");
const FuelTank = require("../models/FuelTank");

/* -------------------------------------------------------------------------- */
/*                                  function                                  */
/* -------------------------------------------------------------------------- */
const validateFuelTankReadingInputs = async (fuelTankParams) => {
  const { fuelTankId, volume, date } = fuelTankParams;

  /* ------------------------------ validations ----------------------------- */
  if (!fuelTankId || volume === "" || isNaN(Number(volume)) || !date)
    return {
      statusCode: 400,
      message: "Please fill in all required fields.",
    };

  if (volume < 0)
    return {
      statusCode: 400,
      message: "Volume must be greater than or equal to 0.",
    };

  if (!isValidDate(date))
    return {
      statusCode: 400,
      message: "Date must be a valid date.",
    };

  const { statusCode, message } = await validateExistingRecord(
    FuelTank,
    fuelTankId
  );

  if (statusCode !== 200)
    return {
      statusCode,
      message,
    };

  const existingFuelTankReading = await FuelTankReading.findOne({
    date,
    fuelTank: fuelTankId,
  });

  if (existingFuelTankReading)
    throw {
      statusCode: 400,
      message:
        "Fuel Tank Reading for this date already exists. If you wish to edit an entry, go to the edit page instead.",
    };

  return {
    statusCode: 200,
  };
};

/* -------------------------------------------------------------------------- */
/*                                 controllers                                */
/* -------------------------------------------------------------------------- */
module.exports.createFuelTankReading = async (req, res) => {
  try {
    const { fuelTankId, volume, date } = req.body;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message } = await validateFuelTankReadingInputs({
      fuelTankId,
      volume,
      date,
    });

    if (statusCode !== 200) return res.status(statusCode).json({ message });

    const newFuelTankReading = await FuelTankReading.create({
      fuelTank: fuelTankId,
      volume,
      date,
    }).populate("fuelTank");

    res.status(201).json({
      message: "Fuel Tank Reading created successfully.",
      data: newFuelTankReading,
    });
  } catch (error) {
    handleError(
      "Something went wrong while creating the fuel tank reading.",
      error,
      res
    );
  }
};

module.exports.batchCreateFuelTankReadings = async (req, res) => {
  let createdFuelTankReadings = [];
  try {
    const { date, fuelTankReadings } = req.body;

    /* ----------------------------- validation ----------------------------- */
    createdFuelTankReadings = await Promise.all(
      fuelTankReadings.map(async (reading) => {
        const { fuelTankId, volume } = reading;

        /* -------------------------- validation; ------------------------- */
        const { statusCode, message } = await validateFuelTankReadingInputs({
          fuelTankId,
          volume,
          date,
        });

        if (statusCode !== 200) throw { statusCode, message };

        const newFuelTankReading = await FuelTankReading.create({
          fuelTank: fuelTankId,
          volume,
          date,
        });

        return {
          statusCode: 201,
          message: "Fuel Tank Reading created successfully.",
          data: await newFuelTankReading.populate("fuelTank"),
        };
      })
    );

    return res.status(201).json({
      message: "Fuel Tank Readings created successfully.",
      data: createdFuelTankReadings.map(
        (fuelTankReading) => fuelTankReading.data
      ),
    });
  } catch (error) {
    handleError(
      error.statusCode
        ? error.message
        : "Something went wrong while creating the fuel tank readings.",
      error,
      res
    );

    /* --------------------- delete any records created --------------------- */
    await Promise.all(
      createdFuelTankReadings.map(async (reading) => {
        return await FuelTankReading.findByIdAndDelete(reading.data._id);
      })
    );
  }
};

module.exports.getAllFuelTankReadings = async (req, res) => {
  try {
    const {
      fuelTankId,
      startDate,
      endDate,
      page = 1,
      pageSize = 25,
    } = req.query;

    /* ----------------------------- validation ----------------------------- */
    if (startDate >= endDate)
      return res.status(400).json({
        message: "Start date must be before end date.",
      });

    const query = {};

    // Filter by tank ID
    if (fuelTankId) {
      query.fuelTank = fuelTankId;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.recordedAt = {};
      if (startDate) query.recordedAt.$gte = new Date(startDate);
      if (endDate) query.recordedAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    // Get total count before pagination
    const count = await FuelTankReading.countDocuments(query);

    // Fetch paginated readings
    const data = await FuelTankReading.find(query)
      .sort({ recordedAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .populate("fuelTank") // optional: populate fuel tank
      .lean();

    return res.status(200).json({
      message: "Fuel tank readings retrieved successfully.",
      data,
      count,
    });
  } catch (error) {
    handleError(
      "Something went wrong while getting the fuel tank readings.",
      error,
      res
    );
  }
};

module.exports.getSingleFuelTankReading = async (req, res) => {
  try {
    const { id } = req.params;

    /* ------------------------------ validate ------------------------------ */
    const { statusCode, message, data } = await validateExistingRecord(
      FuelTank,
      id
    );

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message,
        data: data.populate("fuelTank"),
      });
  } catch (error) {
    handleError(
      "Something went wrong while getting the fuel tank reading.",
      error,
      res
    );
  }
};

module.exports.updateFuelTankReading = async (req, res) => {
  try {
    const { id } = req.params;

    const { fuelTankId, volume, date } = req.body;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message } = await validateExistingRecord(
      FuelTankReading,
      id
    );

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message,
      });

    const { statusCode: inputStatusCode, message: inputMessage } =
      await validateFuelTankReadingInputs({
        fuelTankId,
        volume,
        date,
      });

    if (inputStatusCode !== 200)
      return res.status(inputStatusCode).json({
        message: inputMessage,
      });

    const updatedFuelTankReading = await FuelTankReading.findByIdAndUpdate(id, {
      fuelTank: fuelTankId,
      volume,
      date,
    }).populate("fuelTank");

    return res.status(200).json({
      message: "Fuel Tank Reading updated successfully.",
      data: updatedFuelTankReading,
    });
  } catch (error) {
    handleError(
      "Something went wrong while updating the fuel tank reading.",
      error,
      res
    );
  }
};

module.exports.deleteFuelTankReading = async (req, res) => {
  try {
    const { id } = req.params;

    /* ------------------------------ validate ------------------------------ */
    const { statusCode, message } = await validateExistingRecord(
      FuelTankReading,
      id
    );

    if (statusCode !== 200) return res.status(statusCode).json({ message });

    const deletedFuelTankReading = await FuelTankReading.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Fuel Tank Reading deleted successfully.",
      data: deletedFuelTankReading,
    });
  } catch (error) {
    handleError(
      "Something went wrong while deleting the fuel tank reading.",
      error,
      res
    );
  }
};
