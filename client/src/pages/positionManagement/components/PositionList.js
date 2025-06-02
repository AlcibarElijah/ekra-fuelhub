/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- components ------------------------------- */
import Table from "../../../components/table/Table";

/* ---------------------------------- hooks --------------------------------- */
import { usePositionService } from "../../../hooks/usePositionService";
import { useNavigate } from "react-router-dom";

const PositionList = () => {
  const { getPositions } = usePositionService();
  const navigate = useNavigate();

  const columns = [
    {
      name: "Name",
      field: "name",
    },
    {
      name: "",
      customRender: (row) => {
        return (
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(`/employee/management/position/edit/${row._id}`)
            }
          >
            Edit
          </button>
        );
      },
      className: "text-end",
    },
  ];

  /* ------------------------------------------------------------------------ */
  /*                                 functions                                */
  /* ------------------------------------------------------------------------ */
  const onFetch = async (_) => {
    try {
      const { data, count } = await getPositions();

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

export default PositionList;
