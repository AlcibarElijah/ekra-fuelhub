/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* ---------------------------------- pages --------------------------------- */
import Login from "./pages/login/Login"

/* ------------------------------- components ------------------------------- */
import Navbar from './components/Navbar';

/* -------------------------------- contexts -------------------------------- */
import { useAuthContext } from "./hooks/useAuthContext"

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        {
          !user &&
          <Login />
        }
        {
          user &&
          (
            <Navbar />
          )
        }
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
