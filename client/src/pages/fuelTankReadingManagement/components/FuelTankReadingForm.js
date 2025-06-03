/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from 'react';
import { formatDateToInputReadableString } from '../../../functions/utils';

/* ---------------------------------- hooks --------------------------------- */
import { useFuelTankService } from '../../../hooks/useFuelTankService';
import { useFuelTankReadingService } from '../../../hooks/useFuelTankReadingService';
import { useParams } from 'react-router-dom';
import { getFuelTankReadingById } from '../../../services/fuelTankReadingService';

const FuelTankReadingForm = () => {
  const { getFuelTanks, isLoading: fuelTankIsLoading } = useFuelTankService();
  const {
    batchCreateFuelTankReadings,
    updateFuelTankReading,
    isLoading: fuelTankReadingIsLoading,
  } = useFuelTankReadingService();
  const { fuelTankReadingId } = useParams();

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  });
  const [fuelTankReadings, setFuelTankReadings] = useState(null);

  const [fuelTanks, setFuelTanks] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  /* ------------------------------------------------------------------------ */
  /*                                 functions                                */
  /* ------------------------------------------------------------------------ */
  const resetForm = () => {
    setFuelTankReadings(
      fuelTankReadings.map((reading) => {
        return {
          ...reading,
          volume: '',
        };
      })
    );
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Prepare payload: filter out empty volumes and convert to numbers
      const cleanedReadings = fuelTankReadings
        .filter(
          (reading) => reading.volume !== '' && !isNaN(Number(reading.volume))
        )
        .map((reading) => ({
          fuelTankId: reading.fuelTankId,
          volume: Number(reading.volume),
        }));

      // Only submit if there is at least one valid reading
      if (cleanedReadings.length === 0) return;

      if (fuelTankReadingId) {
        // Edit mode: update existing reading
        await updateFuelTankReading(fuelTankReadingId, date, cleanedReadings);
      } else {
        // Create mode: batch create
        await batchCreateFuelTankReadings(date, cleanedReadings);
        resetForm();
      }
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
        setFuelTankReadings(
          data.map((tank) => {
            return {
              fuelTankId: tank._id,
              volume: '',
            };
          })
        );
      } catch (error) {}
    };

    const fetchFuelTankReadings = async () => {
      if (!fuelTankReadingId) return;

      try {
        const { data } = await getFuelTankReadingById(fuelTankReadingId);
        setDate(formatDateToInputReadableString(data.date));
        setFuelTankReadings(
          data.volumes.map((reading) => {
            return {
              fuelTankId: reading.fuelTank,
              volume: reading.volume,
            };
          })
        );
      } catch (error) {}
    };

    const initializePage = async () => {
      await fetchFuelTanks();
      await fetchFuelTankReadings();
    };

    initializePage();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsLoading(fuelTankIsLoading || fuelTankReadingIsLoading);
  }, [fuelTankIsLoading, fuelTankReadingIsLoading]);

  return (
    <div>
      <form className='form' onSubmit={!isLoading ? handleSubmit : () => {}}>
        <h4>Fuel Tank Reading Form</h4>
        {fuelTanks ? (
          <>
            <label className='form-label mt-3'>Date:</label>
            <input
              type='date'
              className='form-control'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {fuelTanks.map((fuelTank) => {
              const readingIdx = fuelTankReadings.findIndex(
                (r) => r.fuelTankId === fuelTank._id
              );
              const reading =
                readingIdx !== -1
                  ? fuelTankReadings[readingIdx]
                  : { volume: '' };
              return (
                <div key={`input-key-${fuelTank._id}`}>
                  <label className='form-label mt-3'>
                    {fuelTank.fuelType.name}
                  </label>
                  <input
                    type='number'
                    className='form-control'
                    value={reading.volume}
                    onChange={(e) => {
                      const newReadings = [...fuelTankReadings];
                      if (readingIdx !== -1) {
                        newReadings[readingIdx] = {
                          ...newReadings[readingIdx],
                          volume: e.target.value,
                        };
                        setFuelTankReadings(newReadings);
                      }
                    }}
                    disabled={isLoading}
                    step='0.1'
                  />
                </div>
              );
            })}
            <button className='btn btn-primary btn-sm mt-3'>Submit</button>
          </>
        ) : (
          <div className='d-flex justify-content-center mt-3'>
            <div className='spinner-border' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FuelTankReadingForm;
