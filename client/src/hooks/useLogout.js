/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = () => {
    dispatch({
      type: "LOGOUT"
    })
  }

  return {
    logout
  }
}