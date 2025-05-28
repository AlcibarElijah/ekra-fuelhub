/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import rest from "../functions/rest";

export const getAllRoles = async () => {
  try {
    const response = await rest.get("/api/roles");
    return response;
  } catch (error) {
    throw error
  }
}