/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

/* ---------------------------------- hooks --------------------------------- */
import { useFuelTankService } from '../../../hooks/useFuelTankService';
import { useFuelService } from '../../../hooks/useFuelService';

const FuelTankForm = () => {
  const { id } = useParams();

  const {
    createFuelTank,
    getFuelTankById,
    updateFuelTank,
    isLoading: fuelTankIsLoading,
  } = useFuelTankService();
  const { getFuelTypes, isLoading: fuelIsLoading } = useFuelService();

  const [fuelTypeId, setFuelTypeId] = useState('');
  const [capacity, setCapacity] = useState('');
  const [deadstock, setDeadstock] = useState('');
  const [acceptableVariance, setAcceptableVariance] = useState('');

  const [fuelTypeChoices, setFuelTypeChoices] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  /* ------------------------------------------------------------------------ */
  /*                                 functions                                */
  /* ------------------------------------------------------------------------ */
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!id) {
        await createFuelTank({
          fuelTypeId,
          capacity,
          deadstock,
          acceptableVariance,
        });

        emptyForm();
      } else {
        await updateFuelTank(id, {
          fuelTypeId,
          capacity,
          deadstock,
          acceptableVariance,
        });
      }
    } catch (error) {}
  };

  const emptyForm = () => {
    setCapacity('');
    setDeadstock('');
    setAcceptableVariance('');
  };

  /* ------------------------------------------------------------------------ */
  /*                                useEffects                                */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    const fetchFuelTypes = async () => {
      try {
        const { data } = await getFuelTypes({});

        setFuelTypeChoices(data);
        if (!id) setFuelTypeId(data[0]._id);
      } catch (error) {}
    };

    const fetchFuelTank = async () => {
      try {
        const fuelTank = await getFuelTankById(id);

        setFuelTypeId(String(fuelTank.fuelType._id));
        setCapacity(String(fuelTank.capacity));
        setDeadstock(String(fuelTank.deadstock));
        setAcceptableVariance(String(fuelTank.acceptableVariance));
      } catch (error) {}
    };

    emptyForm();
    fetchFuelTypes();
    if (id) fetchFuelTank();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    setIsLoading(fuelTankIsLoading || fuelIsLoading);
  }, [fuelTankIsLoading, fuelIsLoading]);

  return (
    <div>
      <form className='form' onSubmit={!isLoading ? handleSubmit : null}>
        <h4>Fuel Tank Form</h4>
        <label className='form-label mt-3'>Fuel Type:</label>
        <select
          className='form-control'
          value={fuelTypeId}
          onChange={(e) => setFuelTypeId(e.target.value)}
          disabled={isLoading}
        >
          {fuelTypeChoices &&
            fuelTypeChoices.map((fuelType) => (
              <option key={fuelType._id} value={fuelType._id}>
                {fuelType.name}
              </option>
            ))}
        </select>
        <label className='form-label mt-3'>Capacity:</label>
        <input
          type='number'
          className='form-control'
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <label className='form-label mt-3'>Deadstock:</label>
        <input
          type='number'
          className='form-control'
          value={deadstock}
          onChange={(e) => setDeadstock(e.target.value)}
        />
        <label className='form-label mt-3'>Acceptable Variance:</label>
        <input
          type='number'
          className='form-control'
          value={acceptableVariance}
          onChange={(e) => setAcceptableVariance(e.target.value)}
        />
        <button className='btn btn-primary btn-sm mt-3' disabled={isLoading}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default FuelTankForm;
