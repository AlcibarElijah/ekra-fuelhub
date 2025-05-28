/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState } from "react";

/* ---------------------------------- hooks --------------------------------- */
import { useFuelService } from "../../../hooks/useFuelService";

const FuelForm = () => {
  const { createFuelType, isLoading } = useFuelService();

  const [name, setName] = useState("");

  /* ------------------------------------------------------------------------ */
  /*                                 functions                                */
  /* ------------------------------------------------------------------------ */
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await createFuelType({ name });

      emptyForm();
    } catch (error) {}
  };

  const emptyForm = () => {
    setName("");
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <h4>Fuel Form</h4>
        <label className="form-label mt-3">Name:</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary mt-3" disabled={isLoading}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default FuelForm;
