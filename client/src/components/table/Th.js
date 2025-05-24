/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useContext } from "react";
import { TableContext } from "./Table";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const Th = ({ column, disabled }) => {
  const { sort, direction, dispatch } = useContext(TableContext);

  const isSorted = sort === column.field;

  const handleClick = () => {
    if (sort !== column.field) {
      dispatch({
        type: "SET_SORT",
        payload: column.field,
      });
      dispatch({
        type: "SET_SORT_DIRECTION",
        payload: "asc",
      });
    } else if (direction === "asc") {
      dispatch({
        type: "SET_SORT_DIRECTION",
        payload: "desc",
      });
    } else {
      dispatch({
        type: "SET_SORT",
        payload: null,
      });
      dispatch({
        type: "SET_SORT_DIRECTION",
        payload: "asc",
      });
    }
  };

  return (
    <th
      onClick={column.sortable && !disabled ? handleClick : () => {}}
      className={`${
        column.sortable ? "cursor-pointer" : "cursor-not-allowed"
      } select-none ${
        disabled ? "text-gray-400 cursor-not-allowed" : "hover:text-blue-500"
      }`}
    >
      <div className="flex items-center gap-1">
        {column.name}
        {isSorted &&
          (direction === "asc" ? (
            <FaChevronUp className="text-xs ms-1" />
          ) : (
            <FaChevronDown className="text-xs ms-1" />
          ))}
      </div>
    </th>
  );
};

export default Th;
