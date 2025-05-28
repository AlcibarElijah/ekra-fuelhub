/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- components ------------------------------- */
import Table from "../../../components/table/Table"

/* ---------------------------------- hooks --------------------------------- */
import { useFuelService } from "../../../hooks/useFuelService"

const FuelList = () => {
  const { getFuelTypes } = useFuelService();

  const columns = [
    {
      name: "Fuel Type",
      field: "name"
    }
  ]

  const onFetch = async (state) => {
    try {
      const { data, count } = await getFuelTypes(state);

      return {
        rows: data,
        count,
      };
    } catch (error) {
      
    }
  }

  return (
    <div>
      <Table
        columns={columns}
        onFetch={onFetch}
      />
    </div>
  );
}
 
export default FuelList;