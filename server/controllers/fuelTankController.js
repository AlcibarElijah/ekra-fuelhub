/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const { handleError, validateExistingRecord } = require("./functions/utils");

/* ---------------------------------- model --------------------------------- */
const FuelTank = require("../models/FuelTank");
const Fuel = require("../models/Fuel");

/* -------------------------------------------------------------------------- */
/*                                controllers                                */
/* -------------------------------------------------------------------------- */
module.exports.createFuelTank = async (req, res) => {
  try {
    const { fuelTypeId, capacity, deadstock, acceptableVariance } = req.body;

    /* ----------------------------- validations ---------------------------- */
    if (
      !fuelTypeId ||
      capacity === "" ||
      isNaN(Number(capacity)) ||
      deadstock === "" ||
      isNaN(Number(deadstock)) ||
      acceptableVariance === "" ||
      isNaN(Number(acceptableVariance))
    )
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });

    if (capacity < 0 || deadstock < 0 || acceptableVariance < 0)
      return res.status(400).json({
        message:
          "Capacity, deadstock, and acceptable variance must be greater than 0.",
      });

    const { statusCode, message } = await validateExistingRecord(
      Fuel,
      fuelTypeId
    );

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message,
      });

    const newFuelTank = await FuelTank.create({
      fuelType: fuelTypeId,
      capacity,
      deadstock,
      acceptableVariance,
    });
    res.status(201).json({
      message: "Fuel Tank created successfully.",
      data: newFuelTank,
    });
  } catch (error) {
    handleError(
      "Something went wrong while creating the fuel tank.",
      error,
      res
    );
  }
};

module.exports.getAllFuelTanks = async (req, res) => {
  try {
    // * I don't think this needs any query params because the fuel tanks
    // * should be only a few records
    const fuelTanks = await FuelTank.find().populate("fuelType");

    const totalCount = await FuelTank.countDocuments();

    res.status(200).json({
      message: "Fuel Tanks retrieved successfully.",
      data: fuelTanks,
      count: totalCount,
    });
  } catch (error) {
    handleError(
      "Something went wrong while getting the fuelTanks.",
      error,
      res
    );
  }
};

module.exports.getSingleFuelTank = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validations ---------------------------- */
    const {
      statusCode,
      message,
      data: existingFuelTank,
    } = await validateExistingRecord(FuelTank, id);

    const populatedTank = await existingFuelTank.populate("fuelType");

    return res.status(statusCode).json({
      message,
      data: populatedTank,
    });
  } catch (error) {
    handleError(
      "Something went wrong while getting the fuel tank.",
      error,
      res
    );
  }
};

module.exports.updateFuelTank = async (req, res) => {
  try {
    const { id } = req.params;
    const { fuelTypeId, capacity, deadstock, acceptableVariance } = req.body;

    /* ----------------------------- validations ---------------------------- */
    if (
      !fuelTypeId ||
      capacity === null ||
      deadstock === null ||
      acceptableVariance === null
    )
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });

    if (capacity < 0 || deadstock < 0 || acceptableVariance < 0)
      return res.status(400).json({
        message: "Capacity and deadstock must be greater than 0.",
      });

    const { statusCode: fuelStatusCode, message: fuelMessage } =
      await validateExistingRecord(Fuel, fuelTypeId);

    if (fuelStatusCode !== 200)
      return res.status(fuelStatusCode).json({
        message: fuelMessage,
      });

    const validation = await validateExistingRecord(FuelTank, id);

    if (validation.statusCode !== 200)
      return res.status(validation.statusCode).json({
        message: validation.message,
      });

    const updatedFuelTank = await FuelTank.findByIdAndUpdate(
      id,
      { fuelType: fuelTypeId, capacity, deadstock, acceptableVariance },
      { new: true }
    );

    res.status(200).json({
      message: "Fuel Tank updated successfully.",
      data: updatedFuelTank,
    });
  } catch (error) {
    handleError(
      "Something went wrong while updating the fuel tank.",
      error,
      res
    );
  }
};

module.exports.deleteFuelTank = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validations ---------------------------- */
    const validation = await validateExistingRecord(FuelTank, id);

    if (validation.statusCode !== 200)
      return res.status(validation.statusCode).json({
        message: validation.message,
      });

    const deletedFuelTank = await FuelTank.findByIdAndDelete(id);
    res.status(200).json({
      message: "Fuel Tank deleted successfully",
      data: deletedFuelTank,
    });
  } catch (error) {
    handleError(
      "Something went wrong while deleting the fuel tank.",
      error,
      res
    );
  }
};
