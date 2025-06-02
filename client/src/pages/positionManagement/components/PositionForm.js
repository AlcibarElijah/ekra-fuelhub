/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from "react";

/* ---------------------------------- hooks --------------------------------- */
import { usePositionService } from "../../../hooks/usePositionService";
import { useParams } from "react-router-dom";

const PositionForm = () => {
  const {
    createPosition,
    getPositionById,
    updatePosition,
    isLoading: positionIsLoading,
  } = usePositionService();
  const { id } = useParams();

  const [name, setName] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  /* ------------------------------------------------------------------------ */
  /*                                 functions                                */
  /* ------------------------------------------------------------------------ */
  const resetForm = () => {
    setName("");
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      if (id) await updatePosition(id, { name });
      else {
        await createPosition({ name });
        resetForm();
      }
    } catch (error) {}
  };

  /* ------------------------------------------------------------------------ */
  /*                                useEffects                                */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const position = await getPositionById(id);

        setName(position.name);
      } catch (error) {}
    };

    resetForm();
    if (id) fetchPosition();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    setIsLoading(positionIsLoading);
  }, [positionIsLoading]);

  return (
    <form className="form" onSubmit={onSubmit}>
      <h4>Position Form</h4>
      <label className="form-label mt-3">Name: </label>
      <input
        type="text"
        className="form-control"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />
      <button className="btn btn-primary mt-3" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
};

export default PositionForm;
