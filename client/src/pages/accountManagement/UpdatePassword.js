/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { useUserService } from "../../hooks/useUserService";
import { useAuthContext } from "../../hooks/useAuthContext";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { updateUserPassword } = useUserService();

  const { user } = useAuthContext();

  return (
    <div className="container mt-3">
      <form
        className="container form w-50 min-width-300-x"
        onSubmit={(e) => {
          e.preventDefault();
          updateUserPassword(user._id, password, confirmPassword);
        }}
      >
        <h3>Update Password</h3>
        <label className="form-label mt-3">New Password:</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="form-label mt-3">Confirm New Password:</label>
        <input
          type="password"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="btn btn-primary mt-3">Change Password</button>
      </form>
    </div>
  );
};

export default UpdatePassword;
