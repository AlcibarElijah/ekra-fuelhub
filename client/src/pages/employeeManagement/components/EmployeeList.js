/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { formatDate } from '../../../functions/utils';

/* ---------------------------------- hooks --------------------------------- */
import { useEmployeeService } from '../../../hooks/useEmployeeService';
import { useNavigate } from 'react-router-dom';

/* ------------------------------- components ------------------------------- */
import Table from '../../../components/table/Table';

const EmployeeList = () => {
  const navigate = useNavigate();

  const columns = [
    {
      name: 'First Name',
      field: 'firstName',
      sortable: true,
    },
    {
      name: 'Last Name',
      field: 'lastName',
      sortable: true,
    },
    {
      name: 'Position',
      customField: (row) => row.position.name,
    },
    {
      name: 'Day Off',
      field: 'dayOff',
    },
    {
      name: 'Birthday',
      customField: (row) => formatDate(row.birthday),
    },
    {
      name: 'Date Started',
      customField: (row) => formatDate(row.dateStarted),
    },
    {
      name: '',
      customRender: (row) => {
        return (
          <button
            className='btn btn-primary btn-sm'
            onClick={() => navigate(`/employee/management/edit/${row._id}`)}
          >
            Edit
          </button>
        );
      },
      className: 'text-end',
    },
  ];

  const { getEmployees } = useEmployeeService();

  const onFetch = async (state) => {
    try {
      const { data, count } = await getEmployees(state);

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

export default EmployeeList;
