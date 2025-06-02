/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const { handleError, validateExistingRecord } = require("./functions/utils");

/* --------------------------------- models --------------------------------- */
const Position = require("../models/Position");

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */
/**
 * Validates if the input of the position is valid
 * @param {object} position - The new position to be created
 * @param {string} position.name - The name of the new position
 * @param {string} [id] - The id of the old position (mostly for updating)
 * @returns {{ statusCode: number, message: string }}
 */
const validatePositionInput = async (position, id) => {
  const { name } = position;

  if (!name)
    return {
      statusCode: 400,
      message: "Please fill in all required fields.",
    };

  const filter = { name };

  if (id) filter._id = { $ne: id };

  const existingPosition = await Position.findOne(filter);

  if (existingPosition)
    return {
      statusCode: 400,
      message: "Position already exists.",
    };

  return {
    statusCode: 200,
    message: "Position is valid.",
  };
};

/* -------------------------------------------------------------------------- */
/*                                 controllers                                */
/* -------------------------------------------------------------------------- */
module.exports.createPosition = async (req, res) => {
  try {
    const { name } = req.body;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message } = await validatePositionInput({ name });

    if (statusCode !== 200) return res.status(statusCode).json({ message });

    /* ------------------------------- create ------------------------------- */
    const newPosition = await Position.create({ name });

    return res.status(201).json({
      message: "New position created successfully.",
      data: newPosition,
    });
  } catch (error) {
    handleError(
      "Something went wrong while creating the position.",
      error,
      res
    );
  }
};

module.exports.getAllPositions = async (req, res) => {
  try {
    const totalCount = await Position.countDocuments();

    const positions = await Position.find().sort("name");

    return res.status(200).json({
      message: "All positions retrieved successfully.",
      data: positions,
      count: totalCount,
    });
  } catch (error) {
    handleError(
      "Something went wrong while getting all positions.",
      error,
      res
    );
  }
};

module.exports.getSinglePosition = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message, data } = await validateExistingRecord(
      Position,
      id
    );

    return res.status(statusCode).json({
      message,
      data,
    });
  } catch (error) {
    handleError("Something went wrong while getting the position.", error, res);
  }
};

module.exports.updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message } = await validateExistingRecord(Position, id);
    if (statusCode !== 200) return res.status(statusCode).json({ message });

    const { statusCode: inputStatusCode, message: inputMessage } =
      await validatePositionInput({ name }, id);
    if (inputStatusCode !== 200)
      return res.status(inputStatusCode).json({ message: inputMessage });

    /* ------------------------------- update ------------------------------- */
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    return res.status(200).json({
      message: "Position updated successfully.",
      data: updatedPosition,
    });
  } catch (error) {
    handleError(
      "Something went wrong while updating the position.",
      error,
      res
    );
  }
};

module.exports.deletePosition = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message } = await validateExistingRecord(Position, id);
    if (statusCode !== 200) return res.status(statusCode).json({ message });

    /* ------------------------------- delete ------------------------------- */
    const deletedPosition = await Position.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Position deleted successfully.",
      data: deletedPosition,
    });
  } catch (error) {
    handleError(
      "Something went wrong while deleting the position.",
      error,
      res
    );
  }
};
