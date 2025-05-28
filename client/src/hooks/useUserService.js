/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { toast } from "react-toastify";
import rest from "../functions/rest";
import { useAuthContext } from "./useAuthContext";
import { useUtils } from "./useUtils";
import {  getUsers as getUsersServices } from "../services/userService";

export const useUserService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const { handleError } = useUtils();

  const createUser = async (newUser) => {
    try {
      setIsLoading(true);

      if (user.role.name !== "admin")
        throw new Error("You are not authorized to create a user.");

      if (newUser.password !== newUser.confirmPassword)
        throw new Error("Passwords do not match.");

      const { message } = await rest.post("/api/users", newUser);

      toast.success(message);
    } catch (error) {
      handleError("Something went wrong creating the user.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async (params) => {
    try {
      setIsLoading(true);
      const response = await getUsersServices(params);

      return response;
    } catch (error) {
      handleError("Something went wrong getting the users.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const updateUser = async (id, updatedUser) => {
    try {
      setIsLoading(true);

      if (user.role.name !== "admin" && String(user._id) !== String(id))
        throw new Error(
          "You are not authorized to update this user's details."
        );
      const { message } = await rest.put(`/api/users/${id}`, updatedUser);

      toast.success(message);
    } catch (error) {
      handleError("Something went wrong updating the user.", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPassword = async (id, password, confirmPassword) => {
    try {
      setIsLoading(true);

      if (user.role.name !== "admin" && String(user._id) !== String(id))
        throw new Error(
          "You are not authorized to update this user's password"
        );

      if (!password || !confirmPassword)
        throw new Error("Please fill in all fields.");

      if (password !== confirmPassword)
        throw new Error("Passwords do not match.");

      const { message } = await rest.put(`/api/users/password/${id}`, {
        password,
      });

      toast.success(message);
    } catch (error) {
      handleError("Something went wrong updating the user's password.", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createUser,
    getUsers,
    updateUser,
    updateUserPassword,
  };
};
