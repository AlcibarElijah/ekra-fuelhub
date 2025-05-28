/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const mongoose = require("mongoose");
const { handleError, validateExistingRecord } = require("./functions/utils");

/* ---------------------------------- model --------------------------------- */
const Fuel = require("../models/Fuel");

/* -------------------------------------------------------------------------- */
/*                                controllers                                */
/* -------------------------------------------------------------------------- */
module.exports.createFuel = async (req, res) => {
  try {
    const { name } = req.body;

    /* ----------------------------- validations ---------------------------- */
    if (!name)
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });

    const existingFuel = await Fuel.findOne({ name });
    if (existingFuel)
      return res.status(400).json({ message: "Fuel already exists." });

    const newFuel = await Fuel.create({ name });
    res.status(201).json({
      message: "Fuel created successfully.",
      data: newFuel,
    });
  } catch (error) {
    handleError(
      "Something went wrong while creating the user level.",
      error,
      res
    );
  }
};

module.exports.getAllFuels = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, name } = req.query;

    // build filter
    const filter = {};
    if (name) filter.name = name;

    // get total count of users matching the filters
    const totalCount = await Fuel.countDocuments(filter);

    const fuels = await Fuel.find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      message: "Fuels retrieved successfully.",
      data: fuels,
      count: totalCount,
    });
  } catch (error) {
    handleError("Something went wrong while getting the fuels.", error, res);
  }
};

module.exports.getSingleFuel = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validations ---------------------------- */
    const validation = await validateExistingRecord(Fuel, id);

    const responseBody = {
      message: validation.message,
    };

    if (validation.data) {
      responseBody.data = validation.data;
    }

    return res.status(validation.statusCode).json(responseBody);
  } catch (error) {
    handleError("Something went wrong while getting the fuel.", error, res);
  }
};

module.exports.updateFuel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    /* ----------------------------- validations ---------------------------- */
    const validation = await validateExistingRecord(Fuel, id);

    if (validation.statusCode !== 200)
      return res.status(validation.statusCode).json({
        message: validation.message,
      });

    const existingFuel = await Fuel.findOne({ name });
    if (existingFuel && String(existingFuel._id) !== String(id))
      return res.status(400).json({
        message: "Fuel already exists.",
      });

    const updatedFuel = await Fuel.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    res.status(200).json({
      message: "Fuel updated successfully.",
      data: updatedFuel,
    });
  } catch (error) {
    handleError("Something went wrong while updating the fuel.", error, res);
  }
};

module.exports.deleteFuel = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validations ---------------------------- */
    const validation = await validateExistingRecord(Fuel, id);

    if (validation.statusCode !== 200)
      return res.status(validation.statusCode).json({
        message: validation.message,
      });

    const deletedFuel = await Fuel.findByIdAndDelete(id);
    res.status(200).json({
      message: "Fuel deleted successfully",
      data: deletedFuel,
    });
  } catch (error) {
    handleError("Something went wrong while deleting the fuel.", error, res);
  }
};
