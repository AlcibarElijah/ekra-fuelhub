/* -------------------------------------------------------------------------- */
/*                                   import                                   */
/* -------------------------------------------------------------------------- */
import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useLogin();

  return (
    <div className='container w-25 min-width-300-x mt-3'>
      <h1>Log In</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(username, password);
        }}
      >
        <label className='form-label mt-3'>Username:</label>
        <input
          type='text'
          className='form-control'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className='form-label mt-3'>Password:</label>
        <input
          type='password'
          className='form-control'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='btn btn-primary btn-sm mt-3' disabled={isLoading}>
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
