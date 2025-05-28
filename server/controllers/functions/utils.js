/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const mongoose = require("mongoose");

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */
/* ---------------------- handle error from controller ---------------------- */
/**
 * @description - Handles error from controller
 * @param {string} errorMessage - Error message to be passed in the response
 * @param {object} error - Error object
 * @param {object} res - Response object
 */
module.exports.handleError = (errorMessage, error, res) => {
  console.error(errorMessage, error);
  res.status(500).json({
    message: errorMessage,
  });
};

/* ------------ validates that a record in a certain model exists ----------- */
/**
 * Checks whether a record with a certain ID exists in a given model.
 *
 * @param {object} model - The database model to check against.
 * @param {string|ObjectId} id - The ID of the record to be checked.
 *
 * @returns {{ statusCode: number, message: string, data: object }}
 * An object containing the status code, a descriptive message, and the found record (if any).
 */
module.exports.validateExistingRecord = async (model, id) => {
  try {
    /* ----------------------------- validations ---------------------------- */
    if (!model || !id) throw new Error("Invalid parameters.");

    // check id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid id.");

    // check if record exists
    const record = await model.findById(id);

    if (!record) throw new Error(`${model.modelName} not found.`);

    return {
      statusCode: 200,
      message: "Record found.",
      data: record,
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message,
      data: null,
    };
  }
};

/* -------- converts filter to something mongoose can read and filter ------- */
/**
 * Converts filter to something mongoose can read and filter
 * 
 * @param {object} filter - An object of filters to be converted
 * @returns { object } - mongoose readable filter
 */
module.exports.buildFilter = (filter) => {
  return Object.fromEntries(
    Object.entries(filter)
      .filter(([_, value]) => value != null && value !== "")
      .map(([key, value]) => [key, { $regex: new RegExp(value, "i") }])
  );
};

/* ------ convert sort object to something mongoose can read and sort ------- */
/**
 * Converts sort to something mongoose can read and sort
 * 
 * @param {object} sort - An object of sorts to be converted
 * @returns { object } - mongoose readable sort
 */
module.exports.buildSort = (sort, direction) => {
  if (!sort || !direction) return {};

  return {
    [sort]: direction === "asc" ? 1 : -1,
  };
};

/* -------------------- removes password from user object ------------------- */
/**
 * Removes password from user object
 * 
 * @param {object} user - user object
 * @returns user object with no password
 */
module.exports.cleanedUser = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { password, ...cleanedUser } = user.toObject ? user.toObject() : user;
  return cleanedUser;
};
