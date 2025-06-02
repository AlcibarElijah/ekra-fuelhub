/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { toast } from "react-toastify";

/* -------------------------------- services -------------------------------- */
import employeeService from "../services/employeeService";

/* ---------------------------------- hooks --------------------------------- */
import { useUtils } from "./useUtils";

export const useEmployeeService = () => {
  const { handleError } = useUtils();
  const [isLoading, setIsLoading] = useState(false);

  const createEmployee = async (newEmployee) => {
    try {
      setIsLoading(true);
      const { message } = await employeeService.createEmployee(newEmployee);
      toast.success(message);
    } catch (error) {
      handleError("Something went wrong while creating the employee.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployees = async (params) => {
    try {
      setIsLoading(true);
      const { data, count } = await employeeService.getEmployees(params);
      return { data, count };
    } catch (error) {
      handleError("Something went wrong while getting the Employees.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeById = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await employeeService.getEmployee(id);
      return data;
    } catch (error) {
      handleError("Something went wrong while getting the employee.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployee = async (id, updatedEmployee) => {
    try {
      setIsLoading(true);
      const { message } = await employeeService.updateEmployee(id, updatedEmployee);
      toast.success(message);
    } catch (error) {
      handleError("Something went wrong while updating the employee.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      setIsLoading(true);
      const { message } = await employeeService.deleteEmployee(id);
      toast.success(message);
    } catch (error) {
      handleError("Something went wrong while deleting the employee.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
  };
};