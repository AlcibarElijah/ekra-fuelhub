/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from 'react';
import { formatNumberWithCommas, formatDate } from '../../../functions/utils';

/* ------------------------------- components ------------------------------- */
import Table from '../../../components/table/Table';
import Spinner from '../../../components/Spinner';

/* ---------------------------------- hooks --------------------------------- */
import { useFuelTankService } from '../../../hooks/useFuelTankService';
import { useFuelTankReadingService } from '../../../hooks/useFuelTankReadingService';
import { useNavigate } from 'react-router-dom';

// Edit button component for each row
const EditButton = ({ onClick, disabled }) => (
  <button
    className='btn btn-primary btn-sm'
    onClick={onClick}
    disabled={disabled}
  >
    Edit
  </button>
);

const FuelTankReadingList = () => {
  const { getFuelTanks, isLoading: fuelTankIsLoading } = useFuelTankService();
  const { getAllFuelTankReadings } = useFuelTankReadingService();
  const navigate = useNavigate();

  const [fuelTanks, setFuelTanks] = useState(null);
  const [columns, setColumns] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  /* ------------------------------------------------------------------------ */
  /*                                 functions                                */
  /* ------------------------------------------------------------------------ */
  // The backend returns: [{ _id, date, readings: [{ fuelTank, volume, ... }] }, ...]
  const formatRows = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((readingGroup) => ({
      _id: readingGroup._id,
      date: formatDate(readingGroup.date),
      readings: Array.isArray(readingGroup.volumes) ? readingGroup.volumes : [],
    }));
  };

  const onFetch = async (state) => {
    const { data, count } = await getAllFuelTankReadings({});
    // data is expected to be an array of grouped readings from the backend
    return { rows: formatRows(data), count };
  };

  /* ------------------------------------------------------------------------ */
  /*                                useEffects                                */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    const fetchFuelTanks = async () => {
      try {
        const { data } = await getFuelTanks();

        setFuelTanks(data);
        setColumns([
          {
            name: 'Date',
            field: 'date',
          },
          ...data.map((fuelTank) => {
            return {
              name: fuelTank.fuelType.name,
              customField: (row) => {
                // row.readings is now an array of reading objects
                if (!Array.isArray(row.readings)) return '';
                const found = row.readings.find((v) => {
                  const tankId =
                    typeof v.fuelTank === 'object'
                      ? v.fuelTank._id
                      : v.fuelTank;
                  return tankId === fuelTank._id;
                });
                return found ? formatNumberWithCommas(found.volume) : '';
              },
            };
          }),
          {
            name: '',
            customRender: (row) => {
              return (
                <EditButton
                  onClick={() =>
                    navigate(`/fuel/management/tank-reading/edit/${row._id}`)
                  }
                  disabled={false}
                />
              );
            },
          },
        ]);
      } catch (error) {}
    };

    fetchFuelTanks();
  }, []);

  useEffect(() => {
    setIsLoading(fuelTankIsLoading);
  }, [fuelTankIsLoading]);

  return (
    <div>
      {fuelTanks && columns ? (
        <Table columns={columns} onFetch={onFetch} identifier={'date'} />
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default FuelTankReadingList;
