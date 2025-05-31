/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from "react";
import { formatNumberWithCommas } from "../../../functions/utils";

/* ------------------------------- components ------------------------------- */
import Table from "../../../components/table/Table";
import Spinner from "../../../components/Spinner";

/* ---------------------------------- hooks --------------------------------- */
import { useFuelTankService } from "../../../hooks/useFuelTankService";
import { useFuelTankReadingService } from "../../../hooks/useFuelTankReadingService";

const FuelTankReadingList = () => {
  const { getFuelTanks, isLoading: fuelTankIsLoading } = useFuelTankService();
  const { getAllFuelTankReadings } = useFuelTankReadingService();

  const [fuelTanks, setFuelTanks] = useState(null);
  const [columns, setColumns] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  /* ------------------------------------------------------------------------ */
  /*                                 functions                                */
  /* ------------------------------------------------------------------------ */
  const formatRows = (data) => {
    const grouped = Object.values(
      data.reduce((acc, item) => {
        const date = item.date.slice(0, 10); // 'YYYY-MM-DD'
        const tankId = item.fuelTank._id;

        if (!acc[date]) {
          acc[date] = { date, readings: {} };
        }

        acc[date].readings[String(tankId)] = item.volume;
        return acc;
      }, {})
    );

    return grouped;
  };

  const onFetch = async (state) => {
    const { data, count } = await getAllFuelTankReadings({});

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
            name: "Date",
            field: "date",
          },
          ...data.map((fuelTank) => {
            return {
              name: fuelTank.fuelType.name,
              customField: (row) => {
                return formatNumberWithCommas(row.readings[fuelTank._id]);
              },
            };
          }),
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
        <Table columns={columns} onFetch={onFetch} identifier={"date"} />
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default FuelTankReadingList;
