/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useUserService } from "../../../hooks/useUserService";
import { useNavigate } from "react-router-dom";

/* ------------------------------- components ------------------------------- */
import Table from "../../../components/table/Table";

const UserList = () => {
  const navigate = useNavigate();
  
  const columns = [
    {
      name: "First Name",
      field: "firstName",
      sortable: true,
    },
    {
      name: "Last Name",
      field: "lastName",
      sortable: true,
    },
    {
      name: "Username",
      field: "username",
      sortable: true,
    },
    {
      name: "Role",
      customField: (row) => {
        return row.role.name;
      },
    },
    {
      name: "",
      customRender: (row) => {
        return (
          <button className="btn btn-primary" onClick={() => navigate(`/account/management/edit/${row._id}`)}>
            Edit
          </button>
        )
      }
    }
  ];

  const { getUsers } = useUserService();

  const onFetch = async (state) => {
    try {
      const { data, count } = await getUsers(state);

      return {
        rows: data,
        count,
      };
    } catch (error) {
      throw error;
    }
  };

  return (
    <div>
      <Table columns={columns} onFetch={onFetch} />
    </div>
  );
};

export default UserList;
