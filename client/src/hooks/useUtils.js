/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { toast } from 'react-toastify';

export const useUtils = () => {
  /**
   * Prints error to the console and raises a toast error
   *
   * @param {string} message error message
   * @param {object} error error object
   */
  const handleError = (message, error) => {
    console.error(message, error);
    toast.error(error.message || error);
  };

  return {
    handleError,
  };
};
