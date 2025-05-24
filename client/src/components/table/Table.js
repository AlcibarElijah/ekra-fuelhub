/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import {
  useState,
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import "./table.css"

/* -------------------------- pages and components -------------------------- */
import Th from "./Th";
import PaginationControls from "./PaginationControls";

export const TableContext = createContext();

const tableStateReducer = (state, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: action.payload,
      };
    case "SET_SORT":
      return {
        ...state,
        sort: action.payload,
      };
    case "SET_SORT_DIRECTION":
      return {
        ...state,
        direction: action.payload,
      };
    default:
      return state;
  }
};

const Table = ({ className, columns, onFetch }) => {
  if (!columns) throw Error("Table must have columns.");
  if (!onFetch) throw Error("Table must have an onFetch function.");

  const [tableState, dispatch] = useReducer(tableStateReducer, {
    page: 1,
    pageSize: 25,
    filters: null,
    sort: null,
    direction: "asc",
  });
  const [rows, setRows] = useState(null);
  const [count, setCount] = useState(null);

  const fetchRows = useCallback(async () => {
    try {
      setRows(null);

      const { rows, count } = await onFetch({
        ...tableState,
        ...tableState.filters,
      });
      setRows(rows);
      setCount(count);
    } catch (error) {
      console.error("There was an error fetching the rows.", error);
      toast.error(error.message);
    }
  }, [onFetch, tableState]);

  useEffect(() => {
    if (!tableState.isLoading) fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableState]);

  return (
    <TableContext.Provider value={{ ...tableState, dispatch }}>
      <table className={`table ekra-table ${className}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <Th
                key={`th-key-${column?.name}`}
                column={column}
                disabled={!rows}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows ? (
            rows.map((row) => (
              <tr key={`tr-key-${row._id}`}>
                {columns.map((column) => (
                  <td key={`td-key-${column?.name}-${row._id}`}>
                    {column.customRender
                      ? column.customRender(row)
                      : column.customField
                      ? column.customField(row)
                      : row[column.field]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PaginationControls
        maxPages={Math.ceil(count / tableState.pageSize)}
        currentPage={tableState.page}
      />
    </TableContext.Provider>
  );
};

export default Table;
