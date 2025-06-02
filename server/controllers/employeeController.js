/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const {
  handleError,
  isValidDate,
  buildFilter,
  buildSort,
  validateExistingRecord,
} = require("./functions/utils");

/* ---------------------------------- model --------------------------------- */
const Employee = require("../models/Employee");

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */
const validateEmployeeInput = (employee) => {
  const { firstName, lastName, positionId, dayOff, birthday, dateStarted } =
    employee;

  if (
    !firstName ||
    !lastName ||
    !positionId ||
    !dayOff ||
    !birthday ||
    !dateStarted
  )
    return {
      statusCode: 400,
      message: "Please fill in all required fields.",
    };

  if (!isValidDate(birthday))
    return {
      statusCode: 400,
      message: "Birthday must be a valid date.",
    };

  if (!isValidDate(dateStarted))
    return {
      statusCode: 400,
      message: "Date started must be a valid date.",
    };

  const validDayOff = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ].includes(dayOff);

  if (!validDayOff)
    return {
      statusCode: 400,
      message: "Day off must be a valid day of the week.",
    };

  return {
    statusCode: 200,
    message: "Employee is valid.",
  };
};

/* -------------------------------------------------------------------------- */
/*                                 controller                                 */
/* -------------------------------------------------------------------------- */
module.exports.createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, positionId, dayOff, birthday, dateStarted } =
      req.body;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message } = validateEmployeeInput({
      firstName,
      lastName,
      positionId,
      dayOff,
      birthday,
      dateStarted,
    });

    if (statusCode !== 200) return res.status(statusCode).json({ message });

    /* ------------------------------- create ------------------------------- */
    const newEmployee = await Employee.create({
      firstName,
      lastName,
      position: positionId,
      dayOff,
      birthday,
      dateStarted,
    });

    return res.status(201).json({
      message: "New employee created successfully.",
      data: newEmployee,
    });
  } catch (error) {
    handleError(
      "Something went wrong while creating the employee.",
      error,
      res
    );
  }
};

module.exports.getEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 25,
      firstName,
      lastName,
      dayOff,
      sort = "lastName",
      sortDirection = "asc",
    } = req.query;

    /* -------------------------------- prep -------------------------------- */
    const filter = buildFilter({ firstName, lastName, dayOff });
    const sortObj = buildSort(sort, sortDirection);

    const totalCount = await Employee.countDocuments(filter);

    const employees = await Employee.find(filter)
      .sort(sortObj)
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize))
      .populate("position");

    return res.status(200).json({
      message: "Employees retrieved successfully.",
      data: employees,
      count: totalCount,
    });
  } catch (error) {
    handleError(
      "Something went wrong while getting the employees.",
      error,
      res
    );
  }
};

module.exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message, data } = await validateExistingRecord(
      Employee,
      id
    );

    return res.status(statusCode).json({
      message,
      data,
    });
  } catch (error) {
    handleError("Something went wrong while getting the employee.", error, res);
  }
};

module.exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, positionId, dayOff, birthday, dateStarted } =
      req.body;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message } = await validateExistingRecord(Employee, id);
    if (statusCode !== 200) return res.status(statusCode).json({ message });

    const { statusCode: inputStatusCode, message: inputMessage } =
      validateEmployeeInput({
        firstName,
        lastName,
        positionId,
        dayOff,
        birthday,
        dateStarted,
      });

    if (inputStatusCode !== 200)
      return res.status(inputStatusCode).json({ message: inputMessage });

    /* ------------------------------- update ------------------------------- */
    const updatedEmployee = await Employee.findByIdAndUpdate(id, {
      firstName,
      lastName,
      position: positionId,
      dayOff,
      birthday,
      dateStarted,
    });

    return res.status(200).json({
      message: "Employee updated successfully.",
      data: updatedEmployee,
    });
  } catch (error) {
    handleError(
      "Something went wrong while updating the employee.",
      error,
      res
    );
  }
};

module.exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validation ----------------------------- */
    const { statusCode, message } = await validateExistingRecord(Employee, id);
    if (statusCode !== 200) return res.status(statusCode).json({ message });

    /* ------------------------------- delete ------------------------------- */
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Employee deleted successfully.",
      data: deletedEmployee,
    });
  } catch (error) {
    handleError("Something went wrong while deleting the employee", error, res);
  }
};
