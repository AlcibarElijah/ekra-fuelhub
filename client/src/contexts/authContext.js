/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { createContext, useReducer, useEffect } from "react";

export const authContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      // set token in local storage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        token: action.payload.token,
        user: action.payload.user,
        isLoading: false,
      };
    case "LOGOUT":
      // remove token from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        token: null,
        user: null,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [auth, dispatch] = useReducer(authReducer, {
    token: null,
    user: null,
    isLoading: true,
  });

  // set token in local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token) {
      dispatch({
        type: "LOGIN",
        payload: {
          token,
          user: JSON.parse(user),
        },
      });
    }
  }, []);

  return (
    <authContext.Provider value={{ ...auth, dispatch }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
