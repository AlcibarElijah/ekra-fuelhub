/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const mongoose = require("mongoose");

module.exports.handleError = (errorMessage, error, res) => {
  console.error(errorMessage, error);
  res.status(500).json({
    message: errorMessage,
  });
};

module.exports.validateExistingRecord = async (model, id, res) => {
  try {
    /* ----------------------------- validations ---------------------------- */
    if (!res || !model || !id) throw new Error("Invalid parameters.");

    // check id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid id.");

    // check if record exists
    const record = await model.findById(id);

    if (!record) throw new Error(`${model.modelName} not found.`);

    return {
      statusCode: 200,
      message: "Record found.",
      data: record
    }
  } catch (error) {
    return {
      statusCode: 400,
      message: error.message,
      data: null
    };
  }
};

module.exports.buildFilter = (filter) => {
  return Object.fromEntries(
    Object.entries(filter).filter(([_, value]) => value)
  );
}

module.exports.buildSort = (sort, direction) => {
  if (!sort || !direction) return {};

  return {
    [sort]: direction === "asc" ? 1 : -1
  }
}

module.exports.cleanedUser = (user) => {
  const { password, ...cleanedUser } = user.toObject ? user.toObject() : user;
  return cleanedUser;
};