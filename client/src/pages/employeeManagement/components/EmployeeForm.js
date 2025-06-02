/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from "react";
import { formatDateToInputReadableString } from "../../../functions/utils";

/* ---------------------------------- hooks --------------------------------- */
import { useEmployeeService } from "../../../hooks/useEmployeeService";
import { usePositionService } from "../../../hooks/usePositionService";
import { useParams } from "react-router-dom";

const EmployeeForm = () => {
  const {
    createEmployee,
    updateEmployee,
    getEmployeeById,
    isLoading: employeeIsLoading,
  } = useEmployeeService();
  const { getPositions, isLoading: positionIsLoading } = usePositionService();
  const { id } = useParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [positionId, setPositionId] = useState("");
  const [dayOff, setDayOff] = useState("Sunday");
  const [birthday, setBirthday] = useState("");
  const [dateStarted, setDateStarted] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  });

  const [positionChoices, setPositionChoices] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  /* ------------------------------------------------------------------------ */
  /*                                 functions                                */
  /* ------------------------------------------------------------------------ */
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (id)
        await updateEmployee(id, {
          firstName,
          lastName,
          positionId,
          dayOff,
          birthday,
          dateStarted,
        });
      else {
        await createEmployee({
          firstName,
          lastName,
          positionId,
          dayOff,
          birthday,
          dateStarted,
        });

        emptyForm();
      }
    } catch (error) {}
  };

  const emptyForm = () => {
    setFirstName("");
    setLastName("");
    setBirthday("");
  };

  /* ------------------------------------------------------------------------ */
  /*                                useEffects                                */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const { data } = await getPositions();

        setPositionChoices(data);
        if (!id) setPositionId(data[0]._id);
      } catch (error) {}
    };

    const fetchEmployee = async () => {
      try {
        const employee = await getEmployeeById(id);

        setFirstName(employee.firstName);
        setLastName(employee.lastName);
        setBirthday(formatDateToInputReadableString(employee.birthday));
        setDateStarted(formatDateToInputReadableString(employee.dateStarted));
        setPositionId(employee.positionId);
      } catch (error) {}
    };
    
    emptyForm();
    fetchPosition();

    if (id) fetchEmployee();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    setIsLoading(employeeIsLoading || positionIsLoading);
  }, [employeeIsLoading, positionIsLoading]);

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <h4>Employee Form</h4>
        <label className="form-label mt-3">First Name:</label>
        <input
          type="text"
          className="form-control"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isLoading}
        />
        <label className="form-label mt-3">Last Name:</label>
        <input
          type="text"
          className="form-control"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isLoading}
        />
        <label className="form-label mt-3">Position:</label>
        <select
          className="form-control"
          value={positionId}
          onChange={(e) => setPositionId(e.target.value)}
          disabled={isLoading}
        >
          {positionChoices &&
            positionChoices.map((position) => (
              <option key={position._id} value={position._id}>
                {position.name}
              </option>
            ))}
        </select>
        <label className="form-label mt-3">Day Off:</label>
        <select
          className="form-control"
          disabled={isLoading}
          value={dayOff}
          onChange={(e) => setDayOff(e.target.value)}
        >
          <option value="Sunday">Sunday</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>
        <label className="form-label mt-3">Birthday:</label>
        <input
          type="date"
          className="form-control"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          disabled={isLoading}
        />
        <label className="form-label mt-3">Date Started:</label>
        <input
          type="date"
          className="form-control"
          value={dateStarted}
          onChange={(e) => setDateStarted(e.target.value)}
          disabled={isLoading}
        />
        <button className="btn btn-primary mt-3" disabled={isLoading}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
