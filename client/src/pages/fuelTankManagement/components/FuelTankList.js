/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { formatNumberWithCommas } from "../../../functions/utils";

/* ------------------------------- components ------------------------------- */
import Table from "../../../components/table/Table";

/* ---------------------------------- hooks --------------------------------- */
import { useFuelTankService } from "../../../hooks/useFuelTankService";
import { useNavigate } from "react-router-dom";

const FuelTankList = () => {
  const { getFuelTanks } = useFuelTankService();
  const navigate = useNavigate();

  const columns = [
    {
      name: "Fuel Type",
      customField: (row) => row.fuelType.name,
    },
    {
      name: "Capacity",
      customField: (row) => formatNumberWithCommas(row.capacity),
    },
    {
      name: "Deadstock",
      customField: (row) => formatNumberWithCommas(row.deadstock),
    },
    {
      name: "Acceptable Variance",
      customField: (row) => formatNumberWithCommas(row.acceptableVariance),
    },
    {
      name: "",
      customRender: (row) => (
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/fuel/management/tank/edit/${row._id}`)}
        >
          Edit
        </button>
      ),
    },
  ];

  const onFetch = async (state) => {
    try {
      const { data, count } = await getFuelTanks(state);

      return {
        rows: data,
        count,
      };
    } catch (error) {}
  };

  return (
    <div>
      <Table columns={columns} onFetch={onFetch} />
    </div>
  );
};

export default FuelTankList;
