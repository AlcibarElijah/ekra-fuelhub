/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from 'react';
import { getAllRoles } from '../../../services/roleService';
import { toast } from 'react-toastify';
import { useUserService } from '../../../hooks/useUserService';
import { useParams } from 'react-router-dom';
import { getUserById } from '../../../services/userService';

const UserForm = () => {
  const { id } = useParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');

  const [roleChoices, setRoleChoices] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { createUser, updateUser, isLoading: userIsLoading } = useUserService();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data: roles } = await getAllRoles();

        setRoleChoices(roles);
      } catch (error) {
        console.error('Something went wrong fetching the roles.', error);
        toast.error(error.message);
      }
    };

    const fetchUserBeingEdited = async () => {
      try {
        const { data: user } = await getUserById(id);

        setFirstName(user.firstName);
        setLastName(user.lastName);
        setUsername(user.username);
        setRole(user.role._id);
      } catch (error) {
        console.error('Something went wrong fetching the user.', error);
        toast.error(error.message);
      }
    };

    const prepForm = async () => {
      try {
        resetForm();
        setIsLoading(true);
        await fetchRoles();

        if (id) await fetchUserBeingEdited(id);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    prepForm();
  }, [id]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setRole('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formType = id ? 'edit' : 'create';
      const user = {
        firstName,
        lastName,
        username,
        ...(formType === 'create' ? { password, confirmPassword } : {}),
        roleId: role,
      };

      if (formType === 'edit') await updateUser(id, user);
      else {
        await createUser(user);
        resetForm();
      }
    } catch (error) {}
  };

  return (
    <div>
      <h4>User Form</h4>
      {/* Replace with your actual form */}
      <form className='form' onSubmit={handleSubmit}>
        <label className='form-label mt-3'>First Name:</label>
        <input
          type='text'
          className='form-control'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={userIsLoading || isLoading}
        />
        <label className='form-label mt-3'>Last Name:</label>
        <input
          type='text'
          className='form-control'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={userIsLoading || isLoading}
        />
        <label className='form-label mt-3'>Username:</label>
        <input
          type='text'
          className='form-control'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={userIsLoading || isLoading}
        />
        {!id && (
          <>
            <label className='form-label mt-3'>Password:</label>
            <input
              type='password'
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={userIsLoading || isLoading}
            />
            <label className='form-label mt-3'>Confirm Password:</label>
            <input
              type='password'
              className='form-control'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={userIsLoading || isLoading}
            />
          </>
        )}
        <label className='form-label mt-3'>Role:</label>
        <select
          className='form-control title-case'
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={userIsLoading || isLoading}
        >
          {roleChoices &&
            roleChoices.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
        </select>
        <button
          type='submit'
          className='btn btn-primary btn-sm mt-3'
          disabled={userIsLoading || isLoading}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserForm;
