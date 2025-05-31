/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from "react";

/* ---------------------------------- hooks --------------------------------- */
import { useFuelTankService } from "../../../hooks/useFuelTankService";
import { useFuelTankReadingService } from "../../../hooks/useFuelTankReadingService";

const FuelTankReadingForm = () => {
  const { getFuelTanks, isLoading: fuelTankIsLoading } = useFuelTankService();
  const { batchCreateFuelTankReadings, isLoading: fuelTankReadingIsLoading } =
    useFuelTankReadingService();

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  });
  const [fuelTankReadings, setFuelTankReadings] = useState(null);

  const [fuelTanks, setFuelTanks] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  /* ------------------------------------------------------------------------ */
  /*                                 functions                                */
  /* ------------------------------------------------------------------------ */
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      
      const convertedReadings = fuelTankReadings.map((reading, i) => {
        return {
          fuelTankId: fuelTanks[i]._id,
          volume: reading,
        }
      })

      await batchCreateFuelTankReadings(date, convertedReadings);
    } catch (error) {}
  };

  /* ------------------------------------------------------------------------ */
  /*                                useEffects                                */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    const fetchFuelTanks = async () => {
      try {
        const { data } = await getFuelTanks();

        setFuelTanks(data);
        setFuelTankReadings(data.map(() => ""));
      } catch (error) {}
    };

    fetchFuelTanks();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsLoading(fuelTankIsLoading || fuelTankReadingIsLoading);
  }, [fuelTankIsLoading, fuelTankReadingIsLoading]);

  return (
    <div>
      <form className="form" onSubmit={!isLoading ? handleSubmit : () => {}}>
        <h4>Fuel Tank Reading Form</h4>
        {fuelTanks ? (
          <>
            <label className="form-label mt-3">Date:</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {fuelTanks.map((fuelTank, i) => (
              <div key={`input-key-${fuelTank._id}`}>
                <label className="form-label mt-3">
                  {fuelTank.fuelType.name}
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={fuelTankReadings[i] ?? ""}
                  onChange={(e) => {
                    const newReadings = [...fuelTankReadings];
                    newReadings[i] = e.target.value;
                    setFuelTankReadings(newReadings);
                  }}
                  disabled={isLoading}
                />
              </div>
            ))}
            <button className="btn btn-primary mt-3">Submit</button>
          </>
        ) : (
          <div className="d-flex justify-content-center mt-3">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FuelTankReadingForm;
