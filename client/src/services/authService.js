/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import rest from "../functions/rest";


export const login = async (username, password) => {
  try {
    const response = await rest.post("/api/auth/login", { username, password });

    return response;
  } catch (error) {
    throw error;
  }
}