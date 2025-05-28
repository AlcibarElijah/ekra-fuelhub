/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import rest from "../../functions/rest";
import { toast } from "react-toastify";
import { useUserService } from "../../hooks/useUserService";

const AccountSettings = () => {
  // TODO This user variable might still have a value after the user logs out.
  const { user } = useAuthContext();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState(user.role._id);
  const [roleChoices, setRoleChoices] = useState(null);
  const { updateUser, isLoading } = useUserService();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data: roles } = await rest.get("/api/roles");

        setRoleChoices(roles);
      } catch (error) {
        console.error("Something went wrong trying to fetch the roles.", error);
        toast.error(error.message);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(user._id, {
        firstName,
        lastName,
        username,
        roleId: role,
      });
    } catch (error) {}
  };

  return (
    <div className="container mt-3">
      <form
        className="container form w-50 min-width-300-x"
        onSubmit={handleSubmit}
      >
        <h3>Account Settings</h3>
        <label className="form-label">First Name:</label>
        <input
          type="text"
          className="form-control"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label className="form-label mt-3">Last Name:</label>
        <input
          type="text"
          className="form-control"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label className="form-label mt-3">Username:</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {user.role.name === "admin" && (
          <>
            <label className="form-label mt-3">Role:</label>
            <select
              className="form-select title-case"
              value={role._id}
              onChange={(e) => setRole(e.target.value)}
            >
              {roleChoices &&
                roleChoices.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
            </select>
          </>
        )}
        <button className="btn btn-primary mt-3" disabled={isLoading}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
