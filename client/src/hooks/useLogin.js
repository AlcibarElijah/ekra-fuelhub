/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { login as getToken } from "../services/authService";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext"

export const useLogin = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  const { dispatch } = useAuthContext();
  
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const { data } = await getToken(username, password);

      dispatch({
        type: "LOGIN",
        payload: {
          token: data.token,
          user: data.user
        }
      })
    } catch (error) {
      console.error("There was an error logging in.", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    login,
    isLoading
  }
}