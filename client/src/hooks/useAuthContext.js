/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useContext } from "react";

import { authContext } from "../contexts/authContext";

export const useAuthContext = () => {
  const context = useContext(authContext);

  if (!context)
    throw Error("useAuthContext must be used within an AuthContextProvider.")

  return context
}