/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import rest from "../functions/rest";
import { isValidDate } from "../functions/utils";
import { buildQueryParams } from "./functions/utils";

/**
 * @typedef {object} employee
 * @prop {string} employee.firstName - The first name of the new employee
 * @prop {string} employee.lastName - The last name of the new employee
 * @prop {string|objectId} employee.positionId - The id of the position of the new employee
 * @prop {Enumerator["Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"]} newEmployee.dayOff - The day off of the new employee
 * @prop {date} employee.birthday - The birthday of the new employee
 * @prop {date} employee.dateStarted - The date the employee started working
 */

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
    throw Error("Please fill in all required fields.");

  if (
    ![
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].includes(dayOff)
  )
    throw Error("Day off must be a valid day of the week.");

  if (!isValidDate(birthday)) throw Error("Birthday must be a valid date.");

  if (!isValidDate(dateStarted))
    throw Error("Date started must be a valid date.");
};

/* ---------------------------- create employee ---------------------------- */
/**
 * Call the create employee API
 *
 * @param {employee} newEmployee - The new employee to be created
 * @returns {{ message: string, data: object }} message and new employee
 */
export const createEmployee = async (newEmployee) => {
  try {
    validateEmployeeInput(newEmployee);

    const response = await rest.post("/api/employees", newEmployee);
    return response;
  } catch (error) {
    throw error;
  }
};

/* ----------------------------- get employees ----------------------------- */
/**
 * Gets all the employees
 * @param {object} params - The parameters for the fetch
 * @param {number} [params.page] - The page number
 * @param {number} [params.pageSize] - The page size
 * @param {object} [params.filters] - The filter object
 * @param {string} [params.filters.firstName] - The first name filter
 * @param {string} [params.filters.lastName] - The last name filter
 * @param {Enumerator["Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"]} [params.filters.dayOff] - The day off filter
 * @param {string} [params.sort] - The field to sort by
 * @param {Enumerator["asc" | "desc"]} [params.direction] - The direction to sort by
 * @returns {{ message: string, data: object[], count }} message and employees
 */
export const getEmployees = async (params) => {
  try {
    const queryParams = buildQueryParams(params);
    const response = await rest.get(`/api/employees?${queryParams}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/* --------------------------- get employee by id -------------------------- */
/**
 * Get a specific employee from id
 *
 * @param {string|objectId} id
 * @returns {{ message: string, data: object }} message and employee
 */
export const getEmployee = async (id) => {
  try {
    const response = await rest.get(`/api/employees/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/* ---------------------------- update employee ---------------------------- */
/**
 * Update a employee by id
 *
 * @param {string|objectId} id - id of the employee to be updated
 * @param {object} updatedEmployee - The updated employee
 * @returns {{ message: string, data: object }} server response
 */
export const updateEmployee = async (id, updatedEmployee) => {
  try {
    /* ----------------------------- validation ----------------------------- */
    validateEmployeeInput(updatedEmployee);

    const response = await rest.put(`/api/employees/${id}`, updatedEmployee);
    return response;
  } catch (error) {
    throw error;
  }
};

/* --------------------------- delete employee --------------------------- */
/**
 * Delete a specific employee by its id
 *
 * @param {string|objectId} id
 * @returns {{ message: string, data: object }} message and employee
 */
export const deleteEmployee = async (id) => {
  try {
    const response = await rest.delete(`/api/employees/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const employeeService = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
};

export default employeeService;
