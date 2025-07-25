/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  formatDateToInputReadableString,
  formatNumberWithCommasAndDecimals,
} from '../../../functions/utils';

/* ---------------------------------- hooks --------------------------------- */
import { useFuelTankService } from '../../../hooks/useFuelTankService';
import { useFuelTankDeliveryService } from '../../../hooks/useFuelTankDeliveryService';
import Spinner from '../../../components/Spinner';

const FuelDeliveryForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const dateOrderedQuery = searchParams.get('dateOrdered');
  const { getFuelTanks, isLoading: fuelTankIsLoading } = useFuelTankService();
  const {
    createFuelDelivery,
    getFuelDeliveryById,
    getFuelDeliveryByIdAndUpdate,
    isLoading: fuelDeliveryIsLoading,
  } = useFuelTankDeliveryService();

  const [isLoading, setIsLoading] = useState(false);

  const [dateOrdered, setDateOrdered] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [credit, setCredit] = useState('0');
  const [volumes, setVolumes] = useState([]);

  const [fuelTanks, setFuelTanks] = useState(null);

  const totalPrice = useMemo(() => {
    return formatNumberWithCommasAndDecimals(
      volumes.reduce((total, volume) => {
        return total + (parseFloat(volume.price) || 0);
      }, 0)
    );
  }, [volumes]);

  const totalVolume = useMemo(() => {
    return formatNumberWithCommasAndDecimals(
      volumes.reduce((total, volume) => {
        return total + (parseFloat(volume.volume) || 0);
      }, 0)
    );
  }, [volumes]);

  /* ------------------------------------------------------------------------ */
  /*                                 functions                                */
  /* ------------------------------------------------------------------------ */
  const setVolumeByIndex = (index, update) => {
    setVolumes((prevVolumes) =>
      prevVolumes.map((volume, i) =>
        i === index ? { ...volume, ...update } : volume
      )
    );
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!id) {
        await createFuelDelivery({
          dateOrdered,
          deliveryDate,
          paymentDueDate,
          volumes: volumes.map((volume) => ({
            fuelTankId: volume.fuelTankId,
            volume: parseFloat(volume.volume),
            price: parseFloat(volume.price),
          })),
          status,
        });
      } else {
        await getFuelDeliveryByIdAndUpdate(id, {
          dateOrdered,
          deliveryDate,
          paymentDueDate,
          status,
          volumes: volumes.map((volume) => ({
            fuelTankId: volume.fuelTankId,
            volume: parseFloat(volume.volume),
            price: parseFloat(volume.price),
          })),
        });
      }

      resetForm(id);
    } catch (error) {
      // do nothing
    }
  };

  const resetForm = useCallback((id) => {
    if (id) return;

    let dateToday;
    if (dateOrderedQuery) {
      dateToday = new Date(dateOrderedQuery);
    } else {
      dateToday = new Date();
    }
    const dateTomorrow = new Date(dateToday);
    dateTomorrow.setDate(dateTomorrow.getDate() + 1);

    setDateOrdered(formatDateToInputReadableString(dateToday));
    setDeliveryDate(formatDateToInputReadableString(dateTomorrow));

    setVolumes([]);
    setStatus('pending');
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                                useEffects                                */
  /* ------------------------------------------------------------------------ */
  // get fuel tanks when page loads
  useEffect(() => {
    const fetchFuelTanks = async () => {
      const { data: fuelTanks } = await getFuelTanks();

      setFuelTanks(fuelTanks);
    };

    const fetchFuelDeliveryById = async () => {
      if (!id) return;
      const currentDelivery = await getFuelDeliveryById(id);
      setDateOrdered(
        formatDateToInputReadableString(currentDelivery.dateOrdered)
      );
      setDeliveryDate(
        formatDateToInputReadableString(currentDelivery.deliveryDate)
      );
      setPaymentDueDate(
        formatDateToInputReadableString(currentDelivery.paymentDueDate)
      );
      setStatus(currentDelivery.status);
      setCredit(currentDelivery.credit);
      setVolumes(
        currentDelivery.volumes.map((volume) => ({
          fuelTankId: volume.fuelTank._id,
          volume: volume.volume.toString(),
          price: volume.price.toString(),
        }))
      );
    };

    fetchFuelTanks();
    fetchFuelDeliveryById();
  }, [id]);

  // set initial dates when page loads and id is null
  useEffect(() => {
    resetForm(id);
  }, [id, resetForm]);

  // set is loading state based on other is loadings
  useEffect(() => {
    setIsLoading(fuelTankIsLoading || fuelDeliveryIsLoading);
  }, [fuelTankIsLoading, fuelDeliveryIsLoading]);

  return (
    <div>
      {fuelTanks ? (
        <form className='form' onSubmit={!isLoading ? handleSubmit : null}>
          <h4>Fuel Delivery Form</h4>
          <label className='form-label mt-3'>Date Ordered:</label>
          <input
            type='date'
            className='form-control'
            value={dateOrdered}
            onChange={(e) => setDateOrdered(e.target.value)}
          />
          <label className='form-label mt-3'>Delivery Date:</label>
          <input
            type='date'
            className='form-control'
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
          <label className='form-label mt-3'>Payment Due Date:</label>
          <input
            type='date'
            className='form-control'
            value={paymentDueDate}
            onChange={(e) => setPaymentDueDate(e.target.value)}
          />
          <label className='form-label mt-3'>Status:</label>
          <select
            className='form-control'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
            <option value='delivered'>Delivered</option>
            <option value='cancelled'>Cancelled</option>
          </select>
          <label className='form-label mt-3'>Credit:</label>
          <input
            type='number'
            className='form-control'
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
          />

          <label className='form-label mt-3'>Volumes:</label>

          {/* Totals indicator */}
          <div className='mb-2'>
            <span className='badge bg-secondary me-2'>
              Total Liters: {totalVolume}L
            </span>
            <span className='badge bg-secondary'>
              Total Price: &#8369;{totalPrice}
            </span>
          </div>
          {volumes.length > 0 &&
            volumes.map((volume, i) => {
              const { fuelTankId } = volume;
              return (
                <div
                  className='card p-3 mt-3 position-relative'
                  key={fuelTankId}
                >
                  <button
                    type='button'
                    className='btn-close position-absolute top-0 end-0 m-2'
                    aria-label='Close'
                    onClick={() =>
                      setVolumes((prevVolumes) =>
                        prevVolumes.filter((_, index) => i !== index)
                      )
                    }
                  ></button>
                  <div className='row align-items-end'>
                    <div className='col-md-4'>
                      <label className='form-label'>Fuel Tank</label>
                      <select
                        value={fuelTankId}
                        className='form-control'
                        onChange={(e) =>
                          setVolumeByIndex(i, { fuelTankId: e.target.value })
                        }
                      >
                        {fuelTanks.map((fuelTank) => (
                          <option
                            value={fuelTank._id}
                            key={`option-${fuelTank._id}`}
                          >
                            {fuelTank.fuelType.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Liters</label>
                      <input
                        type='number'
                        className='form-control'
                        value={volume.volume}
                        onChange={(e) =>
                          setVolumeByIndex(i, {
                            volume: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Price</label>
                      <input
                        type='number'
                        className='form-control'
                        value={volume.price}
                        onChange={(e) =>
                          setVolumeByIndex(i, { price: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          <Link
            to='#'
            className='mt-3 d-inline-block text-decoration-underline text-primary fw-bold align-items-center'
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault();
              setVolumes((prevVolumes) => [
                ...prevVolumes,
                { fuelTankId: fuelTanks[0]?._id, volume: '', price: '' },
              ]);
            }}
          >
            Add Fuel Tank
          </Link>
          <br />
          <button
            type='submit'
            className='btn btn-primary btn-sm mt-3'
            disabled={isLoading}
          >
            Submit
          </button>
        </form>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default FuelDeliveryForm;
