/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { toast } from "react-toastify";

export const useUtils = () => {
  const handleError = (message, error) => {
    console.error(message, error);
    toast.error(error.message);
  };

  return {
    handleError
  }
};
